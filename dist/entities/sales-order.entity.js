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
exports.SalesOrder = void 0;
const typeorm_1 = require("typeorm");
let SalesOrder = class SalesOrder {
    id;
    soNumber;
    clientId;
    orderDate;
    expectedDeliveryDate;
    subtotal;
    taxAmount;
    totalAmount;
    netPrice;
    notes;
    createdBy;
    salesrep;
    createdAt;
    updatedAt;
    riderId;
    assignedAt;
    recipientsName;
    recipientsContact;
    dispatchedBy;
    status;
    myStatus;
    receivedIntoStock;
    deliveredAt;
    deliveryNotes;
    receivedBy;
    receivedAt;
    deliveryImage;
    returnedAt;
    clientName;
    clientEmail;
    clientPhone;
};
exports.SalesOrder = SalesOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'so_number', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "soNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_id', type: 'int' }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_date', type: 'date' }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_delivery_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subtotal', type: 'decimal', precision: 15, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_price', type: 'decimal', precision: 11, scale: 2 }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "netPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'salesrep', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "salesrep", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rider_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "riderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recepients_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "recipientsName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recepients_contact', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "recipientsContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dispatched_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "dispatchedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: ['draft', 'confirmed', 'shipped', 'delivered', 'cancelled', 'in payment', 'paid'],
        default: 'draft'
    }),
    __metadata("design:type", String)
], SalesOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'my_status', type: 'tinyint' }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "myStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_into_stock', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], SalesOrder.prototype, "receivedIntoStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivered_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_notes', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SalesOrder.prototype, "deliveryNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_by', type: 'int' }),
    __metadata("design:type", Number)
], SalesOrder.prototype, "receivedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "receivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_image', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], SalesOrder.prototype, "deliveryImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'returned_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], SalesOrder.prototype, "returnedAt", void 0);
exports.SalesOrder = SalesOrder = __decorate([
    (0, typeorm_1.Entity)('sales_orders')
], SalesOrder);
//# sourceMappingURL=sales-order.entity.js.map