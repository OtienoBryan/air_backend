import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { NoticesModule } from './notices/notices.module';
import { CountriesModule } from './countries/countries.module';
import { SalesOrdersModule } from './sales-orders/sales-orders.module';
import { SalesRepsModule } from './sales-reps/sales-reps.module';
import { StaffModule } from './staff/staff.module';
import { ReceivableAgingModule } from './receivable-aging/receivable-aging.module';
import { InvoicesModule } from './invoices/invoices.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { ProductsModule } from './products/products.module';
import { TasksModule } from './tasks/tasks.module';
import { InventoryModule } from './inventory/inventory.module';
import { CategoriesModule } from './categories/categories.module';
import { AircraftsModule } from './aircrafts/aircrafts.module';
import { DestinationsModule } from './destinations/destinations.module';
import { FlightSeriesModule } from './flight-series/flight-series.module';
import { SeatReservationsModule } from './seat-reservations/seat-reservations.module';
import { PassengersModule } from './passengers/passengers.module';
import { BookingsModule } from './bookings/bookings.module';
import { CrewModule } from './crew/crew.module';
import { AgenciesModule } from './agencies/agencies.module';
import { LuggageModule } from './luggage/luggage.module';
import { AgentsModule } from './agents/agents.module';
import { AccountsModule } from './accounts/accounts.module';
import { IataCodesModule } from './iata-codes/iata-codes.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ChartOfAccountsModule } from './chart-of-accounts/chart-of-accounts.module';
import { FuelingModule } from './fueling/fueling.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { PayrollModule } from './payroll/payroll.module';
import { CargoBookingsModule } from './cargo-bookings/cargo-bookings.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { FlightRoutesModule } from './flight-routes/flight-routes.module';
import { GlobalAuthGuard } from './auth/global-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    ChatModule,
    NoticesModule,
    CountriesModule,
    SalesOrdersModule,
    SalesRepsModule,
    StaffModule,
    ReceivableAgingModule,
    InvoicesModule,
    SuppliersModule,
    PurchaseOrdersModule,
    ProductsModule,
    TasksModule,
    InventoryModule,
    CategoriesModule,
    AircraftsModule,
    DestinationsModule,
    FlightSeriesModule,
    SeatReservationsModule,
    PassengersModule,
    BookingsModule,
    CrewModule,
    AgenciesModule,
    LuggageModule,
    AgentsModule,
    AccountsModule,
    IataCodesModule,
    ExpensesModule,
    ChartOfAccountsModule,
    FuelingModule,
    JournalEntriesModule,
    PayrollModule,
    CargoBookingsModule,
    CurrenciesModule,
    FlightRoutesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule { }
