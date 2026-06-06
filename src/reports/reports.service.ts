import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(private dataSource: DataSource) {}

  async getProfitReport(
    groupBy: 'route' | 'aircraft' | 'flight',
    from?: string,
    to?: string,
  ): Promise<any[]> {
    if (groupBy === 'route')    return this.routeReport(from, to);
    if (groupBy === 'aircraft') return this.aircraftReport(from, to);
    if (groupBy === 'flight')   return this.flightReport(from, to);
    return [];
  }

  // ── Routes ────────────────────────────────────────────────────────────────
  private async routeReport(from?: string, to?: string): Promise<any[]> {
    // Revenue per route (via bookings → flight_series → flight_routes by destinations)
    let revSql = `
      SELECT
        fr.id                                         AS route_id,
        d_from.name                                   AS from_name,
        d_to.name                                     AS to_name,
        fr.route_type,
        COALESCE(SUM(b.total_amount), 0)              AS revenue,
        COALESCE(SUM(b.number_of_passengers), 0)      AS passengers,
        COUNT(DISTINCT b.id)                          AS booking_count
      FROM flight_routes fr
      LEFT JOIN destinations d_from ON d_from.id = fr.from_destination_id
      LEFT JOIN destinations d_to   ON d_to.id   = fr.to_destination_id
      LEFT JOIN flight_series fs
             ON fs.from_destination_id = fr.from_destination_id
            AND fs.to_destination_id   = fr.to_destination_id
      LEFT JOIN bookings b ON b.flight_series_id = fs.id
    `;
    const revParams: any[] = [];
    const revConds: string[] = [];
    if (from) { revConds.push('DATE(b.booking_date) >= ?'); revParams.push(from); }
    if (to)   { revConds.push('DATE(b.booking_date) <= ?'); revParams.push(to); }
    if (revConds.length) revSql += ' WHERE ' + revConds.join(' AND ');
    revSql += ' GROUP BY fr.id, d_from.name, d_to.name, fr.route_type';

    // Expenses per route
    let expSql = `
      SELECT
        e.route_id,
        COALESCE(SUM(je.total_debit), 0) AS expense_amount,
        COALESCE(SUM(e.amount_paid), 0)  AS expense_paid,
        COALESCE(SUM(e.balance), 0)      AS expense_balance,
        COUNT(e.id)                      AS expense_count
      FROM expenses e
      JOIN journal_entries je ON je.id = e.journal_entry_id
      WHERE e.linked_to = 'route' AND e.route_id IS NOT NULL
    `;
    const expParams: any[] = [];
    if (from) { expSql += ' AND DATE(je.entry_date) >= ?'; expParams.push(from); }
    if (to)   { expSql += ' AND DATE(je.entry_date) <= ?'; expParams.push(to); }
    expSql += ' GROUP BY e.route_id';

    const [revRows, expRows] = await Promise.all([
      this.dataSource.query(revSql, revParams),
      this.dataSource.query(expSql, expParams),
    ]);

    const expMap = new Map(expRows.map((r: any) => [Number(r.route_id), r]));

    return revRows
      .filter((r: any) => Number(r.revenue) > 0 || expMap.has(Number(r.route_id)))
      .map((r: any) => this.buildRow(
        r.route_id,
        `${r.from_name ?? '?'} → ${r.to_name ?? '?'}`,
        { route_type: r.route_type },
        r,
        expMap.get(Number(r.route_id)),
      ))
      .sort((a: any, b: any) => b.revenue - a.revenue);
  }

  // ── Aircraft ──────────────────────────────────────────────────────────────
  private async aircraftReport(from?: string, to?: string): Promise<any[]> {
    let revSql = `
      SELECT
        a.id                                          AS aircraft_id,
        a.name                                        AS aircraft_name,
        a.registration,
        a.status                                      AS aircraft_status,
        COALESCE(SUM(b.total_amount), 0)              AS revenue,
        COALESCE(SUM(b.number_of_passengers), 0)      AS passengers,
        COUNT(DISTINCT b.id)                          AS booking_count
      FROM aircrafts a
      LEFT JOIN flights f ON f.aircraft_id = a.id
      LEFT JOIN bookings b
             ON b.flight_series_id = f.series_id
            AND DATE(b.booking_date) = DATE(f.flight_date)
    `;
    const revParams: any[] = [];
    const revConds: string[] = [];
    if (from) { revConds.push('DATE(f.flight_date) >= ?'); revParams.push(from); }
    if (to)   { revConds.push('DATE(f.flight_date) <= ?'); revParams.push(to); }
    if (revConds.length) revSql += ' WHERE ' + revConds.join(' AND ');
    revSql += ' GROUP BY a.id, a.name, a.registration, a.status';

    let expSql = `
      SELECT
        e.aircraft_id,
        COALESCE(SUM(je.total_debit), 0) AS expense_amount,
        COALESCE(SUM(e.amount_paid), 0)  AS expense_paid,
        COALESCE(SUM(e.balance), 0)      AS expense_balance,
        COUNT(e.id)                      AS expense_count
      FROM expenses e
      JOIN journal_entries je ON je.id = e.journal_entry_id
      WHERE e.linked_to = 'aircraft' AND e.aircraft_id IS NOT NULL
    `;
    const expParams: any[] = [];
    if (from) { expSql += ' AND DATE(je.entry_date) >= ?'; expParams.push(from); }
    if (to)   { expSql += ' AND DATE(je.entry_date) <= ?'; expParams.push(to); }
    expSql += ' GROUP BY e.aircraft_id';

    const [revRows, expRows] = await Promise.all([
      this.dataSource.query(revSql, revParams),
      this.dataSource.query(expSql, expParams),
    ]);

    const expMap = new Map(expRows.map((r: any) => [Number(r.aircraft_id), r]));

    return revRows
      .filter((r: any) => Number(r.revenue) > 0 || expMap.has(Number(r.aircraft_id)))
      .map((r: any) => this.buildRow(
        r.aircraft_id,
        `${r.aircraft_name} · ${r.registration}`,
        { status: r.aircraft_status },
        r,
        expMap.get(Number(r.aircraft_id)),
      ))
      .sort((a: any, b: any) => b.revenue - a.revenue);
  }

  // ── Flights ───────────────────────────────────────────────────────────────
  private async flightReport(from?: string, to?: string): Promise<any[]> {
    let revSql = `
      SELECT
        f.id                                          AS flight_id,
        f.flight_no,
        f.flight_date,
        f.status                                      AS flight_status,
        d_from.name                                   AS from_name,
        d_to.name                                     AS to_name,
        COALESCE(SUM(b.total_amount), 0)              AS revenue,
        COALESCE(SUM(b.number_of_passengers), 0)      AS passengers,
        COUNT(DISTINCT b.id)                          AS booking_count
      FROM flights f
      LEFT JOIN flight_series fs ON fs.id = f.series_id
      LEFT JOIN destinations d_from ON d_from.id = fs.from_destination_id
      LEFT JOIN destinations d_to   ON d_to.id   = fs.to_destination_id
      LEFT JOIN bookings b
             ON b.flight_series_id = f.series_id
            AND DATE(b.booking_date) = DATE(f.flight_date)
      WHERE 1=1
    `;
    const revParams: any[] = [];
    if (from) { revSql += ' AND DATE(f.flight_date) >= ?'; revParams.push(from); }
    if (to)   { revSql += ' AND DATE(f.flight_date) <= ?'; revParams.push(to); }
    revSql += ' GROUP BY f.id, f.flight_no, f.flight_date, f.status, d_from.name, d_to.name';
    revSql += ' ORDER BY f.flight_date DESC';

    let expSql = `
      SELECT
        e.flight_id,
        COALESCE(SUM(je.total_debit), 0) AS expense_amount,
        COALESCE(SUM(e.amount_paid), 0)  AS expense_paid,
        COALESCE(SUM(e.balance), 0)      AS expense_balance,
        COUNT(e.id)                      AS expense_count
      FROM expenses e
      JOIN journal_entries je ON je.id = e.journal_entry_id
      WHERE e.linked_to = 'flight' AND e.flight_id IS NOT NULL
    `;
    const expParams: any[] = [];
    if (from) { expSql += ' AND DATE(je.entry_date) >= ?'; expParams.push(from); }
    if (to)   { expSql += ' AND DATE(je.entry_date) <= ?'; expParams.push(to); }
    expSql += ' GROUP BY e.flight_id';

    const [revRows, expRows] = await Promise.all([
      this.dataSource.query(revSql, revParams),
      this.dataSource.query(expSql, expParams),
    ]);

    const expMap = new Map(expRows.map((r: any) => [Number(r.flight_id), r]));

    return revRows
      .filter((r: any) => Number(r.revenue) > 0 || expMap.has(Number(r.flight_id)))
      .map((r: any) => this.buildRow(
        r.flight_id,
        `${r.flight_no} · ${r.from_name ?? '?'} → ${r.to_name ?? '?'}`,
        { flight_date: r.flight_date, status: r.flight_status },
        r,
        expMap.get(Number(r.flight_id)),
      ));
  }

  // ── Helper ────────────────────────────────────────────────────────────────
  private buildRow(id: any, label: string, meta: any, rev: any, exp: any) {
    const revenue        = Number(rev.revenue        ?? 0);
    const expense_amount = Number(exp?.expense_amount ?? 0);
    const gross_profit   = revenue - expense_amount;
    return {
      id,
      label,
      meta,
      revenue,
      passengers:       Number(rev.passengers    ?? 0),
      booking_count:    Number(rev.booking_count  ?? 0),
      expense_amount,
      expense_paid:     Number(exp?.expense_paid    ?? 0),
      expense_balance:  Number(exp?.expense_balance ?? 0),
      expense_count:    Number(exp?.expense_count   ?? 0),
      gross_profit,
      margin: revenue > 0 ? Math.round((gross_profit / revenue) * 100) : 0,
    };
  }
}
