"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivableAgingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sales_order_entity_1 = require("../entities/sales-order.entity");
const client_entity_1 = require("../entities/client.entity");
const client_ledger_entity_1 = require("../entities/client-ledger.entity");
let ReceivableAgingService = class ReceivableAgingService {
    salesOrderRepository;
    clientRepository;
    clientLedgerRepository;
    constructor(salesOrderRepository, clientRepository, clientLedgerRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.clientRepository = clientRepository;
        this.clientLedgerRepository = clientLedgerRepository;
    }
    async getReceivableAging() {
        try {
            console.log('🔍 [ReceivableAging] Starting receivable aging calculation...');
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
            const agingData = [];
            for (const row of result) {
                try {
                    const outstandingAmount = Number(row.outstandingAmount);
                    const oldestOrderDate = row.oldestOrderDate;
                    if (!oldestOrderDate) {
                        console.log(`⚠️ [ReceivableAging] No order date for client ${row.clientId}`);
                        continue;
                    }
                    const daysSinceOrder = Math.floor((new Date().getTime() - new Date(oldestOrderDate).getTime()) / (1000 * 60 * 60 * 24));
                    let current = 0;
                    let days31to60 = 0;
                    let days61to90 = 0;
                    let days91to120 = 0;
                    let over120Days = 0;
                    if (daysSinceOrder <= 30) {
                        current = outstandingAmount;
                    }
                    else if (daysSinceOrder <= 60) {
                        days31to60 = outstandingAmount;
                    }
                    else if (daysSinceOrder <= 90) {
                        days61to90 = outstandingAmount;
                    }
                    else if (daysSinceOrder <= 120) {
                        days91to120 = outstandingAmount;
                    }
                    else {
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
                }
                catch (clientError) {
                    console.error(`❌ [ReceivableAging] Error processing client ${row.clientId}:`, clientError);
                    continue;
                }
            }
            console.log(`✅ [ReceivableAging] Processed ${agingData.length} clients with outstanding amounts`);
            return agingData;
        }
        catch (error) {
            console.error('❌ [ReceivableAging] Error calculating receivable aging:', error);
            throw error;
        }
    }
    async getReceivableAgingSummary() {
        try {
            const agingData = await this.getReceivableAging();
            const summary = {
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
        }
        catch (error) {
            console.error('❌ [ReceivableAging] Error calculating summary:', error);
            throw error;
        }
    }
};
exports.ReceivableAgingService = ReceivableAgingService;
exports.ReceivableAgingService = ReceivableAgingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sales_order_entity_1.SalesOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(2, (0, typeorm_1.InjectRepository)(client_ledger_entity_1.ClientLedger)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReceivableAgingService);
//# sourceMappingURL=receivable-aging.service.js.map