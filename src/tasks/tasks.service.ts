import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { SalesRep } from '../entities/sales-rep.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(SalesRep)
    private salesRepRepository: Repository<SalesRep>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    console.log('🔧 [TasksService] Creating task with data:', createTaskDto);
    const task = this.taskRepository.create(createTaskDto);
    console.log('🔧 [TasksService] Created task entity:', task);
    const savedTask = await this.taskRepository.save(task);
    console.log('🔧 [TasksService] Saved task:', savedTask);
    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      relations: ['assignedBy'],
      order: { createdAt: 'DESC' }
    });

    // Parse sales rep IDs and fetch sales reps for each task
    for (const task of tasks) {
      if (task.salesRepId) {
        try {
          const salesRepIds = JSON.parse(task.salesRepId);
          if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
            // Fetch sales reps by IDs
            const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
            task.salesReps = salesReps;
          }
        } catch (error) {
          console.error('Error parsing sales rep IDs:', error);
          task.salesReps = [];
        }
      } else {
        task.salesReps = [];
      }
    }

    return tasks;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignedBy']
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Parse sales rep IDs and fetch sales reps for this task
    if (task.salesRepId) {
      try {
        const salesRepIds = JSON.parse(task.salesRepId);
        if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
          const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
          task.salesReps = salesReps;
        }
      } catch (error) {
        console.error('Error parsing sales rep IDs:', error);
        task.salesReps = [];
      }
    } else {
      task.salesReps = [];
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    console.log(`🔧 [TasksService] Updating task ${id} with data:`, updateTaskDto);
    
    const task = await this.findOne(id);
    console.log(`🔧 [TasksService] Found task:`, { id: task.id, title: task.title });
    
    // If marking as completed, set completedAt
    if (updateTaskDto.isCompleted && !task.isCompleted) {
      updateTaskDto.completedAt = new Date();
      console.log(`🔧 [TasksService] Marking task as completed`);
    } else if (!updateTaskDto.isCompleted && task.isCompleted) {
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

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  async findBySalesRep(salesRepId: number): Promise<Task[]> {
    // Find tasks where the salesRepId JSON contains the given salesRepId
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedBy', 'assignedBy')
      .where('task.salesRepId LIKE :salesRepId', { salesRepId: `%${salesRepId}%` })
      .orderBy('task.createdAt', 'DESC')
      .getMany();

    // Parse sales rep IDs and fetch sales reps for each task
    for (const task of tasks) {
      if (task.salesRepId) {
        try {
          const salesRepIds = JSON.parse(task.salesRepId);
          if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
            const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
            task.salesReps = salesReps;
          }
        } catch (error) {
          console.error('Error parsing sales rep IDs:', error);
          task.salesReps = [];
        }
      } else {
        task.salesReps = [];
      }
    }

    return tasks;
  }

  async findByStatus(status: string): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { status },
      relations: ['assignedBy'],
      order: { createdAt: 'DESC' }
    });

    // Parse sales rep IDs and fetch sales reps for each task
    for (const task of tasks) {
      if (task.salesRepId) {
        try {
          const salesRepIds = JSON.parse(task.salesRepId);
          if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
            const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
            task.salesReps = salesReps;
          }
        } catch (error) {
          console.error('Error parsing sales rep IDs:', error);
          task.salesReps = [];
        }
      } else {
        task.salesReps = [];
      }
    }

    return tasks;
  }

  async findByPriority(priority: string): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { priority },
      relations: ['assignedBy'],
      order: { createdAt: 'DESC' }
    });

    // Parse sales rep IDs and fetch sales reps for each task
    for (const task of tasks) {
      if (task.salesRepId) {
        try {
          const salesRepIds = JSON.parse(task.salesRepId);
          if (Array.isArray(salesRepIds) && salesRepIds.length > 0) {
            const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
            task.salesReps = salesReps;
          }
        } catch (error) {
          console.error('Error parsing sales rep IDs:', error);
          task.salesReps = [];
        }
      } else {
        task.salesReps = [];
      }
    }

    return tasks;
  }

  async getTaskStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    cancelled: number;
  }> {
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
}
