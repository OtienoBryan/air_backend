import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Staff, Department, ChatRoom, ChatMessage, Notice, Country, SalesRep, Region, Route, LoginHistory } from '../entities';
import { Client } from '../entities/client.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { Destination } from '../entities/destination.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { Passenger } from '../entities/passenger.entity';
import { Booking } from '../entities/booking.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { ClientLedger } from '../entities/client-ledger.entity';
import { SalesOrder } from '../entities/sales-order.entity';
import { SalesOrderItem } from '../entities/sales-order-item.entity';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { Fueling } from '../entities/fueling.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseOrderItem } from '../entities/purchase-order-item.entity';
import { Task } from '../entities/task.entity';
import { Crew } from '../entities/crew.entity';
import { FlightCrew } from '../entities/flight-crew.entity';
import { Agency } from '../entities/agency.entity';
import { AgencyLedger } from '../entities/agency-ledger.entity';
import { AgencyDeposit } from '../entities/agency-deposit.entity';
import { Agent } from '../entities/agent.entity';
import { Account } from '../entities/account.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { Expense } from '../entities/expense.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { Luggage } from '../entities/luggage.entity';
import { IataCode } from '../entities/iata-code.entity';
import { AccountType } from '../entities/account-type.entity';
import { CargoBooking } from '../entities/cargo-booking.entity';
import { Currency } from '../entities/currency.entity';
import { FlightRoute } from '../entities/flight-route.entity';
import { FareHistory } from '../entities/fare-history.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
      entities: [Staff, Department, ChatRoom, ChatMessage, Notice, Country, SalesRep, Region, Route, LoginHistory, Client, Product, Category, Aircraft, Destination, FlightSeries, SeatReservation, Passenger, Booking, BookingPassenger, ClientLedger, SalesOrder, SalesOrderItem, Supplier, SupplierLedger, PurchaseOrder, PurchaseOrderItem, Task, Crew, FlightCrew, Agency, AgencyLedger, AgencyDeposit, Agent, Account, AccountLedger, ChartOfAccount, Expense, JournalEntry, JournalEntryLine, Luggage, IataCode, AccountType, Fueling, CargoBooking, Currency, FlightRoute, FareHistory],
  synchronize: false, // Disabled to avoid schema conflicts
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: false,
});
