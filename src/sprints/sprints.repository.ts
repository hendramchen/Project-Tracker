import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from './entities/sprint.entity';

@Injectable()
export class SprintsRepository {
  constructor(
    @InjectRepository(Sprint)
    private readonly repo: Repository<Sprint>,
  ) {}

  async findAll(): Promise<Sprint[]> {
    return this.repo.find({ relations: ['project'] });
  }

  async findByProjectId(projectId: string): Promise<Sprint[]> {
    return this.repo.find({
      where: { projectId },
      relations: ['tasks'],
      order: { startDate: 'ASC' },
    });
  }

  async findById(id: string): Promise<Sprint | null> {
    return this.repo.findOne({ where: { id }, relations: ['project'] });
  }

  async findByIdWithTasks(id: string): Promise<Sprint | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['project', 'tasks'],
    });
  }

  async create(partial: Partial<Sprint>): Promise<Sprint> {
    const sprint = this.repo.create(partial);
    return this.repo.save(sprint);
  }

  async update(id: string, partial: Partial<Sprint>): Promise<Sprint> {
    await this.repo.update(id, partial);
    return this.findById(id) as Promise<Sprint>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
