import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(dto: CreateTaskDto) {
    return this.tasksRepository.create(dto);
  }

  async findAll() {
    return this.tasksRepository.findAll();
  }

  async findBySprintId(sprintId: string) {
    return this.tasksRepository.findBySprintId(sprintId);
  }

  async findOne(id: string) {
    const task = await this.tasksRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    return this.tasksRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.tasksRepository.delete(id);
  }
}
