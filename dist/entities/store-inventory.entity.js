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
exports.StoreInventory = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let StoreInventory = class StoreInventory {
    id;
    store_id;
    product_id;
    quantity;
    product;
};
exports.StoreInventory = StoreInventory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StoreInventory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id', type: 'int' }),
    __metadata("design:type", Number)
], StoreInventory.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'int' }),
    __metadata("design:type", Number)
], StoreInventory.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], StoreInventory.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], StoreInventory.prototype, "product", void 0);
exports.StoreInventory = StoreInventory = __decorate([
    (0, typeorm_1.Entity)('store_inventory')
], StoreInventory);
//# sourceMappingURL=store-inventory.entity.js.map