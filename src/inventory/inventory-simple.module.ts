import { Module } from '@nestjs/common';
import { InventorySimpleController } from './inventory-simple.controller';

@Module({
  controllers: [InventorySimpleController],
})
export class InventorySimpleModule {}
