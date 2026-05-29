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
exports.CreateFlightSeriesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateFlightSeriesDto {
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
exports.CreateFlightSeriesDto = CreateFlightSeriesDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "flt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFlightSeriesDto.prototype, "aircraft_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['From-To', 'From-Via_To', 'MultiLeg']),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "flight_type", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "std", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "sta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFlightSeriesDto.prototype, "number_of_seats", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFlightSeriesDto.prototype, "from_destination_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "from_terminal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "to_terminal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFlightSeriesDto.prototype, "via_destination_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "via_std", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightSeriesDto.prototype, "via_sta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFlightSeriesDto.prototype, "to_destination_id", void 0);
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
], CreateFlightSeriesDto.prototype, "adult_fare", void 0);
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
], CreateFlightSeriesDto.prototype, "child_fare", void 0);
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
], CreateFlightSeriesDto.prototype, "infant_fare", void 0);
//# sourceMappingURL=create-flight-series.dto.js.map