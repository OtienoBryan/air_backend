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
exports.UpdateFlightSeriesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateFlightSeriesDto {
    flt;
    aircraft_id;
    flight_type;
    start_date;
    end_date;
    std;
    sta;
    number_of_seats;
    from_destination_id;
    from_terminal;
    to_terminal;
    via_destination_id;
    via_std;
    via_sta;
    to_destination_id;
    adult_fare;
    child_fare;
    infant_fare;
}
exports.UpdateFlightSeriesDto = UpdateFlightSeriesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "flt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateFlightSeriesDto.prototype, "aircraft_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['From-To', 'From-Via_To', 'MultiLeg']),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "flight_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "std", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "sta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateFlightSeriesDto.prototype, "number_of_seats", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateFlightSeriesDto.prototype, "from_destination_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "from_terminal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "to_terminal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateFlightSeriesDto.prototype, "via_destination_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "via_std", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightSeriesDto.prototype, "via_sta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateFlightSeriesDto.prototype, "to_destination_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === null || value === '' || value === undefined)
            return null;
        const num = Number(value);
        return isNaN(num) ? null : num;
    }),
    (0, class_validator_1.ValidateIf)((o, value) => value !== null),
    (0, class_validator_1.IsNumber)({}, { message: 'adult_fare must be a number' }),
    __metadata("design:type", Object)
], UpdateFlightSeriesDto.prototype, "adult_fare", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === null || value === '' || value === undefined)
            return null;
        const num = Number(value);
        return isNaN(num) ? null : num;
    }),
    (0, class_validator_1.ValidateIf)((o, value) => value !== null),
    (0, class_validator_1.IsNumber)({}, { message: 'child_fare must be a number' }),
    __metadata("design:type", Object)
], UpdateFlightSeriesDto.prototype, "child_fare", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === null || value === '' || value === undefined)
            return null;
        const num = Number(value);
        return isNaN(num) ? null : num;
    }),
    (0, class_validator_1.ValidateIf)((o, value) => value !== null),
    (0, class_validator_1.IsNumber)({}, { message: 'infant_fare must be a number' }),
    __metadata("design:type", Object)
], UpdateFlightSeriesDto.prototype, "infant_fare", void 0);
//# sourceMappingURL=update-flight-series.dto.js.map