import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExceptionType } from '../entities/exception-type.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/exception-types')
@UseGuards(JwtAuthGuard)
export class ExceptionTypesController {
  constructor(
    @InjectRepository(ExceptionType)
    private readonly repo: Repository<ExceptionType>,
  ) {}

  @Get()
  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  @Post()
  create(@Body() body: { name: string; notification?: string }) {
    const e = this.repo.create({ name: body.name, notification: body.notification ?? null });
    return this.repo.save(e);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; notification?: string | null },
  ) {
    const e = await this.repo.findOneOrFail({ where: { id } });
    if (body.name         !== undefined) e.name         = body.name;
    if (body.notification !== undefined) e.notification = body.notification ?? null;
    return this.repo.save(e);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.repo.delete(id);
    return { message: 'Deleted' };
  }
}
