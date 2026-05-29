"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sales_order_entity_1 = require("../entities/sales-order.entity");
const client_entity_1 = require("../entities/client.entity");
const sales_order_item_entity_1 = require("../entities/sales-order-item.entity");
const product_entity_1 = require("../entities/product.entity");
const sales_orders_service_1 = require("./sales-orders.service");
const sales_orders_controller_1 = require("./sales-orders.controller");
let SalesOrdersModule = class SalesOrdersModule {
};
exports.SalesOrdersModule = SalesOrdersModule;
exports.SalesOrdersModule = SalesOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sales_order_entity_1.SalesOrder, client_entity_1.Client, sales_order_item_entity_1.SalesOrderItem, product_entity_1.Product])],
        controllers: [sales_orders_controller_1.SalesOrdersController],
        providers: [sales_orders_service_1.SalesOrdersService],
        exports: [sales_orders_service_1.SalesOrdersService],
    })
], SalesOrdersModule);
//# sourceMappingURL=sales-orders.module.js.map