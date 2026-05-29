import { CreateChartOfAccountDto } from './create-chart-of-account.dto';
declare const UpdateChartOfAccountDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateChartOfAccountDto>>;
export declare class UpdateChartOfAccountDto extends UpdateChartOfAccountDto_base {
    name?: string;
    code?: string;
    account_type?: number;
}
export {};
