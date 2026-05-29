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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("../entities/task.entity");
const sales_rep_entity_1 = require("../entities/sales-rep.entity");
let TasksService = class TasksService {
    taskRepository;
    salesRepRepository;
    constructor(taskRepository, salesRepRepository) {
        this.taskRepository = taskRepository;
        this.salesRepRepository = salesRepRepository;
    }
    async create(createTaskDto) {
        console.log('🔧 [TasksService] Creating task with data:', createTaskDto);
        const task = this.taskRepository.create(createTaskDto);
        console.log('🔧 [TasksService] Created task entity:', task);
        const savedTask = await this.taskRepository.save(task);
        console.log('🔧 [TasksService] Saved task:', savedTask);
        return savedTask;
    }
    async findAll() {
        const tasks = await this.taskRepository.find({
            relations: ['assignedBy'],
            order: { createdAt: 'DESC' }
        });
        for (const task of tasks) {
            if (task.salesRepId) {
                try {
                    const salesRepIds = JSON.parse(task.salesRepId);
                    if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
                        const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
                        task.salesReps = salesReps;
                    }
                }
                catch (error) {
                    console.error('Error parsing sales rep IDs:', error);
                    task.salesReps = [];
                }
            }
            else {
                task.salesReps = [];
            }
        }
        return tasks;
    }
    async findOne(id) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['assignedBy']
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        if (task.salesRepId) {
            try {
                const salesRepIds = JSON.parse(task.salesRepId);
                if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
                    const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
                    task.salesReps = salesReps;
                }
            }
            catch (error) {
                console.error('Error parsing sales rep IDs:', error);
                task.salesReps = [];
            }
        }
        else {
            task.salesReps = [];
        }
        return task;
    }
    async update(id, updateTaskDto) {
        console.log(`🔧 [TasksService] Updating task ${id} with data:`, updateTaskDto);
        const task = await this.findOne(id);
        console.log(`🔧 [TasksService] Found task:`, { id: task.id, title: task.title });
        if (updateTaskDto.isCompleted && !task.isCompleted) {
            updateTaskDto.completedAt = new Date();
            console.log(`🔧 [TasksService] Marking task as completed`);
        }
        else if (!updateTaskDto.isCompleted && task.isCompleted) {
            updateTaskDto.completedAt = null;
            console.log(`🔧 [TasksService] Marking task as not completed`);
        }
        Object.assign(task, updateTaskDto);
        console.log(`🔧 [TasksService] Task after assignment:`, {
            id: task.id,
            title: task.title,
            salesRepId: task.salesRepId,
            isCompleted: task.isCompleted
        });
        const savedTask = await this.taskRepository.save(task);
        console.log(`🔧 [TasksService] Task saved successfully:`, { id: savedTask.id, title: savedTask.title });
        return savedTask;
    }
    async remove(id) {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
    }
    async findBySalesRep(salesRepId) {
        const tasks = await this.taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.assignedBy', 'assignedBy')
            .where('task.salesRepId LIKE :salesRepId', { salesRepId: `%${salesRepId}%` })
            .orderBy('task.createdAt', 'DESC')
            .getMany();
        for (const task of tasks) {
            if (task.salesRepId) {
                try {
                    const salesRepIds = JSON.parse(task.salesRepId);
                    if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
                        const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
                        task.salesReps = salesReps;
                    }
                }
                catch (error) {
                    console.error('Error parsing sales rep IDs:', error);
                    task.salesReps = [];
                }
            }
            else {
                task.salesReps = [];
            }
        }
        return tasks;
    }
    async findByStatus(status) {
        const tasks = await this.taskRepository.find({
            where: { status },
            relations: ['assignedBy'],
            order: { createdAt: 'DESC' }
        });
        for (const task of tasks) {
            if (task.salesRepId) {
                try {
                    const salesRepIds = JSON.parse(task.salesRepId);
                    if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
                        const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
                        task.salesReps = salesReps;
                    }
                }
                catch (error) {
                    console.error('Error parsing sales rep IDs:', error);
                    task.salesReps = [];
                }
            }
            else {
                task.salesReps = [];
            }
        }
        return tasks;
    }
    async findByPriority(priority) {
        const tasks = await this.taskRepository.find({
            where: { priority },
            relations: ['assignedBy'],
            order: { createdAt: 'DESC' }
        });
        for (const task of tasks) {
            if (task.salesRepId) {
                try {
                    const salesRepIds = JSON.parse(task.salesRepId);
                    if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
                        const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
                        task.salesReps = salesReps;
                    }
                }
                catch (error) {
                    console.error('Error parsing sales rep IDs:', error);
                    task.salesReps = [];
                }
            }
            else {
                task.salesReps = [];
            }
        }
        return tasks;
    }
    async getTaskStats() {
        const [total, completed, pending, inProgress, cancelled] = await Promise.all([
            this.taskRepository.count(),
            this.taskRepository.count({ where: { isCompleted: true } }),
            this.taskRepository.count({ where: { status: 'pending' } }),
            this.taskRepository.count({ where: { status: 'in-progress' } }),
            this.taskRepository.count({ where: { status: 'cancelled' } })
        ]);
        return {
            total,
            completed,
            pending,
            inProgress,
            cancelled
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(sales_rep_entity_1.SalesRep)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map