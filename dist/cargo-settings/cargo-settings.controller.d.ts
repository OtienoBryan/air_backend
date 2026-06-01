import { CargoSettingsService } from './cargo-settings.service';
export declare class CargoSettingsController {
    private readonly svc;
    constructor(svc: CargoSettingsService);
    getShcCharges(): Promise<import("../entities/cargo-shc-charge.entity").CargoShcCharge[]>;
    createShcCharge(b: any): Promise<import("../entities/cargo-shc-charge.entity").CargoShcCharge>;
    updateShcCharge(id: number, b: any): Promise<import("../entities/cargo-shc-charge.entity").CargoShcCharge | null>;
    deleteShcCharge(id: number): Promise<import("typeorm").DeleteResult>;
    getFreightRates(): Promise<import("../entities/cargo-freight-rate.entity").CargoFreightRate[]>;
    createFreightRate(b: any): Promise<import("../entities/cargo-freight-rate.entity").CargoFreightRate>;
    updateFreightRate(id: number, b: any): Promise<import("../entities/cargo-freight-rate.entity").CargoFreightRate | null>;
    deleteFreightRate(id: number): Promise<import("typeorm").DeleteResult>;
    getHandlingFees(): Promise<import("../entities/cargo-handling-fee.entity").CargoHandlingFee[]>;
    createHandlingFee(b: any): Promise<import("../entities/cargo-handling-fee.entity").CargoHandlingFee>;
    updateHandlingFee(id: number, b: any): Promise<import("../entities/cargo-handling-fee.entity").CargoHandlingFee | null>;
    deleteHandlingFee(id: number): Promise<import("typeorm").DeleteResult>;
}
