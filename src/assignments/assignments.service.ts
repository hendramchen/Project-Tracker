import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignmentsRepository } from './assignments.repository';
import { AssignEmployeeSkillDto } from './dto/assign-employee-skill.dto';
import { UpdateEmployeeSkillDto } from './dto/update-employee-skill.dto';
import { AssignEmployeeProjectDto } from './dto/assign-employee-project.dto';
import { UpdateEmployeeProjectDto } from './dto/update-employee-project.dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly assignmentsRepository: AssignmentsRepository) {}

  // ─── Employee Skills ───

  async assignSkillToEmployee(dto: AssignEmployeeSkillDto) {
    const existing = await this.assignmentsRepository.findEmployeeSkill(
      dto.employeeId,
      dto.skillId,
    );
    if (existing) {
      throw new ConflictException(
        'This skill is already assigned to this employee',
      );
    }
    return this.assignmentsRepository.createEmployeeSkill(dto);
  }

  async updateEmployeeSkill(id: string, dto: UpdateEmployeeSkillDto) {
    const es = await this.assignmentsRepository.findEmployeeSkillById(id);
    if (!es) {
      throw new NotFoundException(
        `Employee skill assignment with ID "${id}" not found`,
      );
    }
    return this.assignmentsRepository.updateEmployeeSkill(id, dto);
  }

  async removeEmployeeSkill(id: string) {
    const es = await this.assignmentsRepository.findEmployeeSkillById(id);
    if (!es) {
      throw new NotFoundException(
        `Employee skill assignment with ID "${id}" not found`,
      );
    }
    return this.assignmentsRepository.removeEmployeeSkill(id);
  }

  async findEmployeesBySkill(skillName: string) {
    const results =
      await this.assignmentsRepository.findEmployeesBySkillName(skillName);
    return results.map((es) => ({
      employeeId: es.employeeId,
      name: `${es.employee.firstName} ${es.employee.lastName}`,
      position: es.employee.position,
      skillName: es.skill.name,
      level: es.level,
      yearsOfExperience: es.yearsOfExperience,
    }));
  }

  // ─── Employee Projects ───

  async assignEmployeeToProject(dto: AssignEmployeeProjectDto) {
    const existing = await this.assignmentsRepository.findEmployeeProject(
      dto.employeeId,
      dto.projectId,
    );
    if (existing) {
      throw new ConflictException(
        'This employee is already actively assigned to this project',
      );
    }
    return this.assignmentsRepository.createEmployeeProject(dto);
  }

  async updateEmployeeProject(id: string, dto: UpdateEmployeeProjectDto) {
    const ep = await this.assignmentsRepository.findEmployeeProjectById(id);
    if (!ep) {
      throw new NotFoundException(
        `Employee project assignment with ID "${id}" not found`,
      );
    }
    return this.assignmentsRepository.updateEmployeeProject(id, dto);
  }

  async removeEmployeeProject(id: string) {
    const ep = await this.assignmentsRepository.findEmployeeProjectById(id);
    if (!ep) {
      throw new NotFoundException(
        `Employee project assignment with ID "${id}" not found`,
      );
    }
    return this.assignmentsRepository.removeEmployeeProject(id);
  }

  // ─── Resource Planning ───

  async getUtilization() {
    const allocations =
      await this.assignmentsRepository.findAllActiveAllocations();

    const employeeMap = new Map<
      string,
      {
        employeeId: string;
        name: string;
        position: string;
        totalAllocation: number;
        projects: {
          projectId: string;
          projectName: string;
          role: string;
          allocationPercentage: number;
        }[];
      }
    >();

    for (const ep of allocations) {
      const key = ep.employeeId;
      if (!employeeMap.has(key)) {
        employeeMap.set(key, {
          employeeId: ep.employeeId,
          name: `${ep.employee.firstName} ${ep.employee.lastName}`,
          position: ep.employee.position,
          totalAllocation: 0,
          projects: [],
        });
      }
      const entry = employeeMap.get(key)!;
      const pct = Number(ep.allocationPercentage);
      entry.totalAllocation += pct;
      entry.projects.push({
        projectId: ep.projectId,
        projectName: ep.project.name,
        role: ep.role,
        allocationPercentage: pct,
      });
    }

    return Array.from(employeeMap.values()).map((e) => ({
      ...e,
      available: Math.max(0, 100 - e.totalAllocation),
    }));
  }

  // ─── Skill-Based Project Matching ───

  async suggestEmployeesForProject(requiredSkillIds: string[]) {
    const employeeSkills =
      await this.assignmentsRepository.findEmployeesWithSkills(
        requiredSkillIds,
      );

    const scoreMap = new Map<
      string,
      {
        employeeId: string;
        name: string;
        position: string;
        matchedSkills: { skillName: string; level: string }[];
        currentAllocation: number;
        score: number;
      }
    >();

    const levelWeight: Record<string, number> = {
      expert: 3,
      intermediate: 2,
      beginner: 1,
    };

    for (const es of employeeSkills) {
      const key = es.employeeId;
      if (!scoreMap.has(key)) {
        const totalAlloc = (es.employee.employeeProjects || []).reduce(
          (sum, ep) => sum + Number(ep.allocationPercentage),
          0,
        );
        scoreMap.set(key, {
          employeeId: es.employeeId,
          name: `${es.employee.firstName} ${es.employee.lastName}`,
          position: es.employee.position,
          matchedSkills: [],
          currentAllocation: totalAlloc,
          score: 0,
        });
      }
      const entry = scoreMap.get(key)!;
      entry.matchedSkills.push({
        skillName: es.skill.name,
        level: es.level,
      });
      entry.score += levelWeight[es.level] || 1;
    }

    return Array.from(scoreMap.values())
      .sort(
        (a, b) =>
          b.score - a.score || a.currentAllocation - b.currentAllocation,
      )
      .map((e, i) => ({
        rank: i + 1,
        ...e,
        available: Math.max(0, 100 - e.currentAllocation),
      }));
  }
}
