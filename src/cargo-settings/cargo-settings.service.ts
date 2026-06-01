import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CargoShcCharge } from '../entities/cargo-shc-charge.entity';
import { CargoFreightRate } from '../entities/cargo-freight-rate.entity';
import { CargoHandlingFee } from '../entities/cargo-handling-fee.entity';

@Injectable()
export class CargoSettingsService {
  constructor(
    @InjectRepository(CargoShcCharge) private shcRepo: Repository<CargoShcCharge>,
    @InjectRepository(CargoFreightRate) private rateRepo: Repository<CargoFreightRate>,
    @InjectRepository(CargoHandlingFee) private feeRepo: Repository<CargoHandlingFee>,
  ) {}

  // SHC Charges
  getShcCharges() { return this.shcRepo.find({ order: { code: 'ASC' } }); }
  createShcCharge(data: Partial<CargoShcCharge>) { return this.shcRepo.save(this.shcRepo.create(data)); }
  async updateShcCharge(id: number, data: Partial<CargoShcCharge>) { await this.shcRepo.update(id, data); return this.shcRepo.findOne({ where: { id } }); }
  deleteShcCharge(id: number) { return this.shcRepo.delete(id); }

  // Freight Rates
  getFreightRates() { return this.rateRepo.find({ order: { origin: 'ASC', min_weight_kg: 'ASC' } }); }
  createFreightRate(data: Partial<CargoFreightRate>) { return this.rateRepo.save(this.rateRepo.create(data)); }
  async updateFreightRate(id: number, data: Partial<CargoFreightRate>) { await this.rateRepo.update(id, data); return this.rateRepo.findOne({ where: { id } }); }
  deleteFreightRate(id: number) { return this.rateRepo.delete(id); }

  // Handling Fees
  getHandlingFees() { return this.feeRepo.find({ order: { name: 'ASC' } }); }
  createHandlingFee(data: Partial<CargoHandlingFee>) { return this.feeRepo.save(this.feeRepo.create(data)); }
  async updateHandlingFee(id: number, data: Partial<CargoHandlingFee>) { await this.feeRepo.update(id, data); return this.feeRepo.findOne({ where: { id } }); }
  deleteHandlingFee(id: number) { return this.feeRepo.delete(id); }
}
