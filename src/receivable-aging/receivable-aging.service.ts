import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesOrder } from '../entities/sales-order.entity';
import { Client } from '../entities/client.entity';
import { ClientLedger } from '../entities/client-ledger.entity';

export interface ReceivableAgingData {
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  totalOutstanding: number;
  current: number; // 0-30 days
  days31to60: number; // 31-60 days
  days61to90: number; // 61-90 days
  days91to120: number; // 91-120 days
  over120Days: number; // Over 120 days
  lastPaymentDate: Date | null;
  lastPaymentAmount: number;
}

export interface ReceivableAgingSummary {
  totalOutstanding: number;
  totalClients: number;
  currentTotal: number;
  days31to60Total: number;
  days61to90Total: number;
  days91to120Total: number;
  over120DaysTotal: number;
}

@Injectable()
export class ReceivableAgingService {
  constructor(
    @InjectRepository(SalesOrder)
    private salesOrderRepository: Repository<SalesOrder>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ClientLedger)
    private clientLedgerRepository: Repository<ClientLedger>,
  ) {}

  async getReceivableAging(): Promise<ReceivableAgingData[]> {
    try {
      console.log('🔍 [ReceivableAging] Starting receivable aging calculation...');

      // Use raw SQL query to join sales_orders with Clients table
      const query = `
        SELECT 
          c.id as clientId,
          c.name as clientName,
          c.email as clientEmail,
          c.contact as clientPhone,
          COALESCE(SUM(so.total_amount), 0) as totalSales,
          COALESCE(SUM(cl.credit), 0) as totalPayments,
          COALESCE(SUM(so.total_amount), 0) - COALESCE(SUM(cl.credit), 0) as outstandingAmount,
          MIN(so.order_date) as oldestOrderDate,
          MAX(cl.created_at) as lastPaymentDate,
          COALESCE(MAX(cl.credit), 0) as lastPaymentAmount
        FROM Clients c
        LEFT JOIN sales_orders so ON c.id = so.client_id
        LEFT JOIN client_ledger cl ON c.id = cl.client_id AND cl.credit > 0
        GROUP BY c.id, c.name, c.email, c.contact
        HAVING outstandingAmount > 0
        ORDER BY outstandingAmount DESC
      `;

      console.log('🔍 [ReceivableAging] Executing SQL query...');
      const result = await this.salesOrderRepository.query(query);
      console.log(`📊 [ReceivableAging] Query returned ${result.length} clients with outstanding amounts`);

      const agingData: ReceivableAgingData[] = [];

      for (const row of result) {
        try {
          const outstandingAmount = Number(row.outstandingAmount);
          const oldestOrderDate = row.oldestOrderDate;
          
          if (!oldestOrderDate) {
            console.log(`⚠️ [ReceivableAging] No order date for client ${row.clientId}`);
            continue;
          }

          // Calculate days since oldest order
          const daysSinceOrder = Math.floor(
            (new Date().getTime() - new Date(oldestOrderDate).getTime()) / (1000 * 60 * 60 * 24)
          );

          // Distribute outstanding amount across aging buckets
          let current = 0;
          let days31to60 = 0;
          let days61to90 = 0;
          let days91to120 = 0;
          let over120Days = 0;

          if (daysSinceOrder <= 30) {
            current = outstandingAmount;
          } else if (daysSinceOrder <= 60) {
            days31to60 = outstandingAmount;
          } else if (daysSinceOrder <= 90) {
            days61to90 = outstandingAmount;
          } else if (daysSinceOrder <= 120) {
            days91to120 = outstandingAmount;
          } else {
            over120Days = outstandingAmount;
          }

          agingData.push({
            clientId: row.clientId,
            clientName: row.clientName || 'Unknown Client',
            clientEmail: row.clientEmail || '',
            clientPhone: row.clientPhone || '',
            totalOutstanding: outstandingAmount,
            current,
            days31to60,
            days61to90,
            days91to120,
            over120Days,
            lastPaymentDate: row.lastPaymentDate ? new Date(row.lastPaymentDate) : null,
            lastPaymentAmount: Number(row.lastPaymentAmount),
          });

          console.log(`✅ [ReceivableAging] Client ${row.clientId}: Outstanding ${outstandingAmount}, Days: ${daysSinceOrder}`);
        } catch (clientError) {
          console.error(`❌ [ReceivableAging] Error processing client ${row.clientId}:`, clientError);
          continue;
        }
      }

      console.log(`✅ [ReceivableAging] Processed ${agingData.length} clients with outstanding amounts`);
      return agingData;
    } catch (error) {
      console.error('❌ [ReceivableAging] Error calculating receivable aging:', error);
      throw error;
    }
  }

  async getReceivableAgingSummary(): Promise<ReceivableAgingSummary> {
    try {
      const agingData = await this.getReceivableAging();

      const summary: ReceivableAgingSummary = {
        totalOutstanding: agingData.reduce((sum, client) => sum + client.totalOutstanding, 0),
        totalClients: agingData.length,
        currentTotal: agingData.reduce((sum, client) => sum + client.current, 0),
        days31to60Total: agingData.reduce((sum, client) => sum + client.days31to60, 0),
        days61to90Total: agingData.reduce((sum, client) => sum + client.days61to90, 0),
        days91to120Total: agingData.reduce((sum, client) => sum + client.days91to120, 0),
        over120DaysTotal: agingData.reduce((sum, client) => sum + client.over120Days, 0),
      };

      console.log('📊 [ReceivableAging] Summary calculated:', summary);
      return summary;
    } catch (error) {
      console.error('❌ [ReceivableAging] Error calculating summary:', error);
      throw error;
    }
  }
}
