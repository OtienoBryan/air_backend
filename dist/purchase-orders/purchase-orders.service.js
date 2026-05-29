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
exports.PurchaseOrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_order_entity_1 = require("../entities/purchase-order.entity");
const purchase_order_item_entity_1 = require("../entities/purchase-order-item.entity");
let PurchaseOrdersService = class PurchaseOrdersService {
    purchaseOrderRepository;
    purchaseOrderItemRepository;
    constructor(purchaseOrderRepository, purchaseOrderItemRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.purchaseOrderItemRepository = purchaseOrderItemRepository;
    }
    async findAll(page = 1, limit = 10, search, status, supplierId, startDate, endDate) {
        const queryBuilder = this.purchaseOrderRepository.createQueryBuilder('po')
            .leftJoinAndSelect('po.supplier', 'supplier');
        if (search) {
            queryBuilder.where('(po.po_number LIKE :search OR po.invoice_number LIKE :search OR supplier.company_name LIKE :search)', { search: `%${search}%` });
        }
        if (status && Object.values(purchase_order_entity_1.PurchaseOrderStatus).includes(status)) {
            queryBuilder.andWhere('po.status = :status', { status });
        }
        if (supplierId) {
            queryBuilder.andWhere('po.supplier_id = :supplierId', { supplierId });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere('po.order_date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            });
        }
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        queryBuilder.orderBy('po.order_date', 'DESC');
        const [purchaseOrders, total] = await queryBuilder.getManyAndCount();
        return { purchaseOrders, total };
    }
    async findBySupplier(supplierId) {
        return this.purchaseOrderRepository.find({
            where: { supplier_id: supplierId },
            relations: ['supplier'],
            order: { order_date: 'DESC' }
        });
    }
    async findOne(id) {
        const purchaseOrder = await this.purchaseOrderRepository.findOne({
            where: { id },
            relations: ['supplier']
        });
        if (!purchaseOrder) {
            throw new common_1.NotFoundException(`Purchase order with ID ${id} not found`);
        }
        return purchaseOrder;
    }
    async findByPoNumber(po_number) {
        return this.purchaseOrderRepository.findOne({
            where: { po_number },
            relations: ['supplier', 'creator']
        });
    }
    async create(createPurchaseOrderDto) {
        const existingPO = await this.findByPoNumber(createPurchaseOrderDto.po_number);
        if (existingPO) {
            throw new Error('PO number already exists');
        }
        const purchaseOrder = this.purchaseOrderRepository.create(createPurchaseOrderDto);
        return this.purchaseOrderRepository.save(purchaseOrder);
    }
    async update(id, updatePurchaseOrderDto) {
        const purchaseOrder = await this.findOne(id);
        if (updatePurchaseOrderDto.po_number && updatePurchaseOrderDto.po_number !== purchaseOrder.po_number) {
            const existingPO = await this.findByPoNumber(updatePurchaseOrderDto.po_number);
            if (existingPO) {
                throw new Error('PO number already exists');
            }
        }
        Object.assign(purchaseOrder, updatePurchaseOrderDto);
        return this.purchaseOrderRepository.save(purchaseOrder);
    }
    async remove(id) {
        const purchaseOrder = await this.findOne(id);
        await this.purchaseOrderRepository.remove(purchaseOrder);
    }
    async getStats() {
        const total = await this.purchaseOrderRepository.count();
        const statusCounts = await this.purchaseOrderRepository
            .createQueryBuilder('po')
            .select('po.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('po.status')
            .getRawMany();
        const statusMap = statusCounts.reduce((acc, item) => {
            acc[item.status] = parseInt(item.count);
            return acc;
        }, {});
        const amountStats = await this.purchaseOrderRepository
            .createQueryBuilder('po')
            .select('SUM(po.total_amount)', 'totalAmount')
            .addSelect('SUM(po.amount_paid)', 'totalPaid')
            .addSelect('SUM(po.balance)', 'totalBalance')
            .getRawOne();
        return {
            total,
            draft: statusMap[purchase_order_entity_1.PurchaseOrderStatus.DRAFT] || 0,
            sent: statusMap[purchase_order_entity_1.PurchaseOrderStatus.SENT] || 0,
            received: statusMap[purchase_order_entity_1.PurchaseOrderStatus.RECEIVED] || 0,
            cancelled: statusMap[purchase_order_entity_1.PurchaseOrderStatus.CANCELLED] || 0,
            totalAmount: parseFloat(amountStats.totalAmount) || 0,
            totalPaid: parseFloat(amountStats.totalPaid) || 0,
            totalBalance: parseFloat(amountStats.totalBalance) || 0,
        };
    }
    async getSupplierStats(supplierId) {
        const orders = await this.findBySupplier(supplierId);
        const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0);
        const totalPaid = orders.reduce((sum, order) => sum + parseFloat(order.amount_paid.toString()), 0);
        const totalBalance = orders.reduce((sum, order) => sum + parseFloat(order.balance.toString()), 0);
        return {
            totalOrders: orders.length,
            totalAmount,
            totalPaid,
            totalBalance,
            recentOrders: orders.slice(0, 10)
        };
    }
    async getPurchaseOrderItems(purchaseOrderId) {
        return this.purchaseOrderItemRepository.find({
            where: { purchase_order_id: purchaseOrderId },
            relations: ['product'],
            order: { id: 'ASC' }
        });
    }
    async createPurchaseOrderWithItems(createData) {
        const queryRunner = this.purchaseOrderRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let subtotal = 0;
            let totalTaxAmount = 0;
            for (const item of createData.items) {
                const itemTotal = item.quantity * item.unit_price;
                subtotal += itemTotal;
                totalTaxAmount += item.tax_amount || 0;
            }
            const totalAmount = subtotal + totalTaxAmount;
            const purchaseOrder = this.purchaseOrderRepository.create({
                po_number: createData.po_number,
                invoice_number: createData.invoice_number,
                supplier_id: createData.supplier_id,
                order_date: new Date(createData.order_date),
                expected_delivery_date: createData.expected_delivery_date ? new Date(createData.expected_delivery_date) : null,
                status: purchase_order_entity_1.PurchaseOrderStatus.DRAFT,
                subtotal,
                tax_amount: totalTaxAmount,
                total_amount: totalAmount,
                amount_paid: 0,
                balance: totalAmount,
                notes: createData.notes,
                created_by: createData.created_by
            });
            const savedPurchaseOrder = await queryRunner.manager.save(purchase_order_entity_1.PurchaseOrder, purchaseOrder);
            const purchaseOrderItems = createData.items.map(item => {
                const itemTotal = item.quantity * item.unit_price;
                return this.purchaseOrderItemRepository.create({
                    purchase_order_id: savedPurchaseOrder.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_price: itemTotal,
                    received_quantity: 0,
                    tax_amount: item.tax_amount || 0,
                    tax_type: item.tax_type || 'VAT'
                });
            });
            await queryRunner.manager.save(purchase_order_item_entity_1.PurchaseOrderItem, purchaseOrderItems);
            await queryRunner.commitTransaction();
            return this.findOne(savedPurchaseOrder.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.PurchaseOrdersService = PurchaseOrdersService;
exports.PurchaseOrdersService = PurchaseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_order_item_entity_1.PurchaseOrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PurchaseOrdersService);
//# sourceMappingURL=purchase-orders.service.js.map