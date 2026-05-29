import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { SalesRep } from '../entities/sales-rep.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private taskRepository;
    private salesRepRepository;
    constructor(taskRepository: Repository<Task>, salesRepRepository: Repository<SalesRep>);
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(): Promise<Task[]>;
    findOne(id: number): Promise<Task>;
    update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(id: number): Promise<void>;
    findBySalesRep(salesRepId: number): Promise<Task[]>;
    findByStatus(status: string): Promise<Task[]>;
    findByPriority(priority: string): Promise<Task[]>;
    getTaskStats(): Promise<{
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
        cancelled: number;
    }>;
}
