import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.repo.find({ relations: ['client'] });
  }

  async findById(id: string): Promise<Project | null> {
    return this.repo.findOne({ where: { id }, relations: ['client'] });
  }

  async findByIdWithEmployees(id: string): Promise<Project | null> {
    return this.repo.findOne({
      where: { id },
      relations: [
        'client',
        'employeeProjects',
        'employeeProjects.employee',
      ],
    });
  }

  async findByIdWithTimeline(id: string): Promise<Project | null> {
    return this.repo.findOne({
      where: { id },
      relations: [
        'client',
        'sprints',
        'sprints.tasks',
      ],
      order: {
        sprints: {
          startDate: 'ASC',
        },
      },
    });
  }

  async create(partial: Partial<Project>): Promise<Project> {
    const project = this.repo.create(partial);
    return this.repo.save(project);
  }

  async update(id: string, partial: Partial<Project>): Promise<Project> {
    await this.repo.update(id, partial);
    return this.findById(id) as Promise<Project>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
