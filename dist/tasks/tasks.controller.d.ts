import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '../entities/task.entity';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(): Promise<Task[]>;
    getStats(): Promise<{
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
        cancelled: number;
    }>;
    findBySalesRep(salesRepId: number): Promise<Task[]>;
    findByStatus(status: string): Promise<Task[]>;
    findByPriority(priority: string): Promise<Task[]>;
    findOne(id: number): Promise<Task>;
    update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
