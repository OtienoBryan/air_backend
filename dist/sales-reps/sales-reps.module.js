"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesRepsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sales_reps_controller_1 = require("./sales-reps.controller");
const sales_reps_service_1 = require("./sales-reps.service");
const sales_rep_attendance_controller_1 = require("./sales-rep-attendance.controller");
const sales_rep_attendance_service_1 = require("./sales-rep-attendance.service");
const sales_rep_entity_1 = require("../entities/sales-rep.entity");
const login_history_entity_1 = require("../entities/login-history.entity");
const country_entity_1 = require("../entities/country.entity");
const region_entity_1 = require("../entities/region.entity");
const route_entity_1 = require("../entities/route.entity");
let SalesRepsModule = class SalesRepsModule {
};
exports.SalesRepsModule = SalesRepsModule;
exports.SalesRepsModule = SalesRepsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sales_rep_entity_1.SalesRep, login_history_entity_1.LoginHistory, country_entity_1.Country, region_entity_1.Region, route_entity_1.Route])],
        controllers: [sales_reps_controller_1.SalesRepsController, sales_rep_attendance_controller_1.SalesRepAttendanceController],
        providers: [sales_reps_service_1.SalesRepsService, sales_rep_attendance_service_1.SalesRepAttendanceService],
        exports: [sales_reps_service_1.SalesRepsService, sales_rep_attendance_service_1.SalesRepAttendanceService],
    })
], SalesRepsModule);
//# sourceMappingURL=sales-reps.module.js.map