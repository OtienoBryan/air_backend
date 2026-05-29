import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  Query,
  UseGuards 
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '../entities/task.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    console.log('🔧 [TasksController] Create task request:', createTaskDto);
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.tasksService.getTaskStats();
  }

  @Get('sales-rep/:salesRepId')
  findBySalesRep(@Param('salesRepId', ParseIntPipe) salesRepId: number): Promise<Task[]> {
    return this.tasksService.findBySalesRep(salesRepId);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string): Promise<Task[]> {
    return this.tasksService.findByStatus(status);
  }

  @Get('priority/:priority')
  findByPriority(@Param('priority') priority: string): Promise<Task[]> {
    return this.tasksService.findByPriority(priority);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    console.log(`🔧 [TasksController] Update request for task ${id}:`, updateTaskDto);
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.tasksService.remove(id).then(() => ({
      message: 'Task deleted successfully'
    }));
  }
}
