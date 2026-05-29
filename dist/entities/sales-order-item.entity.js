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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderItem = void 0;
const typeorm_1 = require("typeorm");
const sales_order_entity_1 = require("./sales-order.entity");
let SalesOrderItem = class SalesOrderItem {
    id;
    salesOrderId;
    productId;
    quantity;
    unitPrice;
    taxAmount;
    totalPrice;
    taxType;
    netPrice;
    unitCost;
    costPrice;
    shippedQuantity;
    salesOrder;
};
exports.SalesOrderItem = SalesOrderItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_order_id' }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "salesOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_amount', type: 'decimal', precision: 11, scale: 2 }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_price', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_type',
        type: 'enum',
        enum: ['16%', 'zero_rated', 'exempted'],
        default: '16%'
    }),
    __metadata("design:type", String)
], SalesOrderItem.prototype, "taxType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_price', type: 'decimal', precision: 11, scale: 2 }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "netPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 11, scale: 2 }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_price', type: 'decimal', precision: 11, scale: 2 }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipped_quantity', type: 'int' }),
    __metadata("design:type", Number)
], SalesOrderItem.prototype, "shippedQuantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_order_entity_1.SalesOrder, salesOrder => salesOrder.id),
    (0, typeorm_1.JoinColumn)({ name: 'sales_order_id' }),
    __metadata("design:type", sales_order_entity_1.SalesOrder)
], SalesOrderItem.prototype, "salesOrder", void 0);
exports.SalesOrderItem = SalesOrderItem = __decorate([
    (0, typeorm_1.Entity)('sales_order_items')
], SalesOrderItem);
//# sourceMappingURL=sales-order-item.entity.js.map