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
exports.SalesRepAttendanceController = void 0;
const common_1 = require("@nestjs/common");
const sales_rep_attendance_service_1 = require("./sales-rep-attendance.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SalesRepAttendanceController = class SalesRepAttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async getAttendanceRecords(salesRepId, startDate, endDate, status, limit, offset) {
        console.log('📊 [SalesRepAttendanceController] Getting attendance records...', {
            salesRepId,
            startDate,
            endDate,
            status,
            limit,
            offset
        });
        console.log('📊 [SalesRepAttendanceController] Raw query parameters:', {
            salesRepIdType: typeof salesRepId,
            salesRepIdValue: salesRepId,
            startDateType: typeof startDate,
            startDateValue: startDate,
            endDateType: typeof endDate,
            endDateValue: endDate,
            statusType: typeof status,
            statusValue: status
        });
        const parsedSalesRepId = salesRepId ? parseInt(salesRepId, 10) : undefined;
        const parsedStatus = status ? parseInt(status, 10) : undefined;
        const parsedLimit = limit ? parseInt(limit, 10) : 50;
        const parsedOffset = offset ? parseInt(offset, 10) : 0;
        return this.attendanceService.getAttendanceRecords(parsedSalesRepId, startDate, endDate, parsedStatus, parsedLimit, parsedOffset);
    }
    async getAttendanceStats(startDate, endDate) {
        console.log('📊 [SalesRepAttendanceController] Getting attendance stats...', {
            startDate,
            endDate
        });
        return this.attendanceService.getAttendanceStats(startDate, endDate);
    }
    async getSalesReps() {
        console.log('👥 [SalesRepAttendanceController] Getting sales reps...');
        return this.attendanceService.getSalesReps();
    }
};
exports.SalesRepAttendanceController = SalesRepAttendanceController;
__decorate([
    (0, common_1.Get)('records'),
    __param(0, (0, common_1.Query)('salesRepId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SalesRepAttendanceController.prototype, "getAttendanceRecords", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SalesRepAttendanceController.prototype, "getAttendanceStats", null);
__decorate([
    (0, common_1.Get)('sales-reps'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesRepAttendanceController.prototype, "getSalesReps", null);
exports.SalesRepAttendanceController = SalesRepAttendanceController = __decorate([
    (0, common_1.Controller)('sales-reps/attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sales_rep_attendance_service_1.SalesRepAttendanceService])
], SalesRepAttendanceController);
//# sourceMappingURL=sales-rep-attendance.controller.js.map