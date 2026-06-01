import { Repository } from 'typeorm';
import { CargoShcCharge } from '../entities/cargo-shc-charge.entity';
import { CargoFreightRate } from '../entities/cargo-freight-rate.entity';
import { CargoHandlingFee } from '../entities/cargo-handling-fee.entity';
export declare class CargoSettingsService {
    private shcRepo;
    private rateRepo;
    private feeRepo;
    constructor(shcRepo: Repository<CargoShcCharge>, rateRepo: Repository<CargoFreightRate>, feeRepo: Repository<CargoHandlingFee>);
    getShcCharges(): Promise<CargoShcCharge[]>;
    createShcCharge(data: Partial<CargoShcCharge>): Promise<CargoShcCharge>;
    updateShcCharge(id: number, data: Partial<CargoShcCharge>): Promise<CargoShcCharge | null>;
    deleteShcCharge(id: number): Promise<import("typeorm").DeleteResult>;
    getFreightRates(): Promise<CargoFreightRate[]>;
    createFreightRate(data: Partial<CargoFreightRate>): Promise<CargoFreightRate>;
    updateFreightRate(id: number, data: Partial<CargoFreightRate>): Promise<CargoFreightRate | null>;
    deleteFreightRate(id: number): Promise<import("typeorm").DeleteResult>;
    getHandlingFees(): Promise<CargoHandlingFee[]>;
    createHandlingFee(data: Partial<CargoHandlingFee>): Promise<CargoHandlingFee>;
    updateHandlingFee(id: number, data: Partial<CargoHandlingFee>): Promise<CargoHandlingFee | null>;
    deleteHandlingFee(id: number): Promise<import("typeorm").DeleteResult>;
}
