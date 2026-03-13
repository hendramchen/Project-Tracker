import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.repo.find({ relations: ['sprint'] });
  }

  async findBySprintId(sprintId: string): Promise<Task[]> {
    return this.repo.find({
      where: { sprintId },
      order: { priority: 'DESC', createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.repo.findOne({ where: { id }, relations: ['sprint'] });
  }

  async create(partial: Partial<Task>): Promise<Task> {
    const task = this.repo.create(partial);
    return this.repo.save(task);
  }

  async update(id: string, partial: Partial<Task>): Promise<Task> {
    await this.repo.update(id, partial);
    return this.findById(id) as Promise<Task>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
