"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCrewDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_crew_dto_1 = require("./create-crew.dto");
class UpdateCrewDto extends (0, mapped_types_1.PartialType)(create_crew_dto_1.CreateCrewDto) {
}
exports.UpdateCrewDto = UpdateCrewDto;
//# sourceMappingURL=update-crew.dto.js.map