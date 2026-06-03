import { Repository } from 'typeorm';
import { ExceptionType } from '../entities/exception-type.entity';
export declare class ExceptionTypesController {
    private readonly repo;
    constructor(repo: Repository<ExceptionType>);
    findAll(): Promise<ExceptionType[]>;
    create(body: {
        name: string;
        notification?: string;
    }): Promise<ExceptionType>;
    update(id: number, body: {
        name?: string;
        notification?: string | null;
    }): Promise<ExceptionType>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
