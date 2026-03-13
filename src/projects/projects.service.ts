import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async create(dto: CreateProjectDto) {
    return this.projectsRepository.create({
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    } as any);
  }

  async findAll() {
    return this.projectsRepository.findAll();
  }

  async findOne(id: string) {
    const project = await this.projectsRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.projectsRepository.update(id, {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    } as any);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.projectsRepository.delete(id);
  }

  async getEmployees(id: string) {
    const project = await this.projectsRepository.findByIdWithEmployees(id);
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return {
      id: project.id,
      name: project.name,
      client: project.client?.name,
      employees: (project.employeeProjects || []).map((ep) => ({
        assignmentId: ep.id,
        employeeId: ep.employeeId,
        name: `${ep.employee.firstName} ${ep.employee.lastName}`,
        position: ep.employee.position,
        role: ep.role,
        allocationPercentage: Number(ep.allocationPercentage),
      })),
    };
  }

  async getTimeline(id: string) {
    const project = await this.projectsRepository.findByIdWithTimeline(id);
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return {
      id: project.id,
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      sprints: (project.sprints || []).map((sprint) => ({
        id: sprint.id,
        name: sprint.name,
        goal: sprint.goal,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: sprint.status,
        taskCount: sprint.tasks?.length || 0,
        completedTasks:
          sprint.tasks?.filter((t) => t.status === 'done').length || 0,
      })),
    };
  }
}
