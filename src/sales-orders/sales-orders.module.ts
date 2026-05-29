import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrder } from '../entities/sales-order.entity';
import { Client } from '../entities/client.entity';
import { SalesOrderItem } from '../entities/sales-order-item.entity';
import { Product } from '../entities/product.entity';
import { SalesOrdersService } from './sales-orders.service';
import { SalesOrdersController } from './sales-orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder, Client, SalesOrderItem, Product])],
  controllers: [SalesOrdersController],
  providers: [SalesOrdersService],
  exports: [SalesOrdersService],
})
export class SalesOrdersModule {}
