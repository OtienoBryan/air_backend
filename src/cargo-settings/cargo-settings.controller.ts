import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CargoSettingsService } from './cargo-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/cargo-settings')
@UseGuards(JwtAuthGuard)
export class CargoSettingsController {
  constructor(private readonly svc: CargoSettingsService) {}

  @Get('shc-charges')       getShcCharges()                                   { return this.svc.getShcCharges(); }
  @Post('shc-charges')      createShcCharge(@Body() b: any)                   { return this.svc.createShcCharge(b); }
  @Put('shc-charges/:id')   updateShcCharge(@Param('id', ParseIntPipe) id: number, @Body() b: any) { return this.svc.updateShcCharge(id, b); }
  @Delete('shc-charges/:id') deleteShcCharge(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteShcCharge(id); }

  @Get('freight-rates')       getFreightRates()                                    { return this.svc.getFreightRates(); }
  @Post('freight-rates')      createFreightRate(@Body() b: any)                    { return this.svc.createFreightRate(b); }
  @Put('freight-rates/:id')   updateFreightRate(@Param('id', ParseIntPipe) id: number, @Body() b: any) { return this.svc.updateFreightRate(id, b); }
  @Delete('freight-rates/:id') deleteFreightRate(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteFreightRate(id); }

  @Get('handling-fees')       getHandlingFees()                                    { return this.svc.getHandlingFees(); }
  @Post('handling-fees')      createHandlingFee(@Body() b: any)                    { return this.svc.createHandlingFee(b); }
  @Put('handling-fees/:id')   updateHandlingFee(@Param('id', ParseIntPipe) id: number, @Body() b: any) { return this.svc.updateHandlingFee(id, b); }
  @Delete('handling-fees/:id') deleteHandlingFee(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteHandlingFee(id); }
}
