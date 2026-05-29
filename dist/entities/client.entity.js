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
exports.Client = void 0;
const typeorm_1 = require("typeorm");
let Client = class Client {
    id;
    name;
    password;
    address;
    latitude;
    longitude;
    balance;
    email;
    regionId;
    region;
    routeId;
    routeName;
    routeIdUpdate;
    routeNameUpdate;
    contact;
};
exports.Client = Client;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Client.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password', type: 'varchar', length: 119, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'varchar', length: 191, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'latitude', type: 'double', nullable: true }),
    __metadata("design:type", Number)
], Client.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'longitude', type: 'double', nullable: true }),
    __metadata("design:type", Number)
], Client.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance', type: 'decimal', precision: 11, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Client.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 191, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region_id', type: 'int' }),
    __metadata("design:type", Number)
], Client.prototype, "regionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region', type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], Client.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Client.prototype, "routeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_name', type: 'varchar', length: 191, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "routeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_id_update', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Client.prototype, "routeIdUpdate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_name_update', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "routeNameUpdate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact', type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], Client.prototype, "contact", void 0);
exports.Client = Client = __decorate([
    (0, typeorm_1.Entity)('Clients')
], Client);
//# sourceMappingURL=client.entity.js.map