"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivableAgingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const receivable_aging_controller_1 = require("./receivable-aging.controller");
const receivable_aging_service_1 = require("./receivable-aging.service");
const sales_order_entity_1 = require("../entities/sales-order.entity");
const client_entity_1 = require("../entities/client.entity");
const client_ledger_entity_1 = require("../entities/client-ledger.entity");
let ReceivableAgingModule = class ReceivableAgingModule {
};
exports.ReceivableAgingModule = ReceivableAgingModule;
exports.ReceivableAgingModule = ReceivableAgingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sales_order_entity_1.SalesOrder, client_entity_1.Client, client_ledger_entity_1.ClientLedger])
        ],
        controllers: [receivable_aging_controller_1.ReceivableAgingController],
        providers: [receivable_aging_service_1.ReceivableAgingService],
        exports: [receivable_aging_service_1.ReceivableAgingService],
    })
], ReceivableAgingModule);
//# sourceMappingURL=receivable-aging.module.js.map