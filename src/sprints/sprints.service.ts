import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintsRepository } from './sprints.repository';

@Injectable()
export class SprintsService {
  constructor(private readonly sprintsRepository: SprintsRepository) {}

  async create(dto: CreateSprintDto) {
    return this.sprintsRepository.create(dto);
  }

  async findAll() {
    return this.sprintsRepository.findAll();
  }

  async findByProjectId(projectId: string) {
    return this.sprintsRepository.findByProjectId(projectId);
  }

  async findOne(id: string) {
    const sprint = await this.sprintsRepository.findById(id);
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID "${id}" not found`);
    }
    return sprint;
  }

  async update(id: string, dto: UpdateSprintDto) {
    await this.findOne(id);
    return this.sprintsRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.sprintsRepository.delete(id);
  }

  async getProgress(id: string) {
    const sprint = await this.sprintsRepository.findByIdWithTasks(id);
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID "${id}" not found`);
    }

    const tasks = sprint.tasks || [];
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const totalStoryPoints = tasks.reduce(
      (sum, t) => sum + (t.storyPoints || 0),
      0,
    );
    const completedStoryPoints = tasks
      .filter((t) => t.status === 'done')
      .reduce((sum, t) => sum + (t.storyPoints || 0), 0);

    return {
      id: sprint.id,
      name: sprint.name,
      goal: sprint.goal,
      status: sprint.status,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      progress: {
        totalTasks: total,
        doneTasks: done,
        inProgressTasks: inProgress,
        todoTasks: todo,
        completionPercentage: total > 0 ? Math.round((done / total) * 100) : 0,
        totalStoryPoints,
        completedStoryPoints,
      },
    };
  }
}
