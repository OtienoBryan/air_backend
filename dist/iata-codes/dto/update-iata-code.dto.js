"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIataCodeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_iata_code_dto_1 = require("./create-iata-code.dto");
class UpdateIataCodeDto extends (0, mapped_types_1.PartialType)(create_iata_code_dto_1.CreateIataCodeDto) {
}
exports.UpdateIataCodeDto = UpdateIataCodeDto;
//# sourceMappingURL=update-iata-code.dto.js.map