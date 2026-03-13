import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { EmployeeSkill } from './entities/employee-skill.entity';
import { EmployeeProject } from './entities/employee-project.entity';

@Injectable()
export class AssignmentsRepository {
  constructor(
    @InjectRepository(EmployeeSkill)
    private readonly employeeSkillRepo: Repository<EmployeeSkill>,
    @InjectRepository(EmployeeProject)
    private readonly employeeProjectRepo: Repository<EmployeeProject>,
  ) {}

  // ─── Employee Skills ───

  async findEmployeeSkill(
    employeeId: string,
    skillId: string,
  ): Promise<EmployeeSkill | null> {
    return this.employeeSkillRepo.findOne({
      where: { employeeId, skillId },
      relations: ['skill', 'employee'],
    });
  }

  async findEmployeeSkillById(id: string): Promise<EmployeeSkill | null> {
    return this.employeeSkillRepo.findOne({
      where: { id },
      relations: ['skill', 'employee'],
    });
  }

  async createEmployeeSkill(
    partial: Partial<EmployeeSkill>,
  ): Promise<EmployeeSkill> {
    const es = this.employeeSkillRepo.create(partial);
    return this.employeeSkillRepo.save(es);
  }

  async updateEmployeeSkill(
    id: string,
    partial: Partial<EmployeeSkill>,
  ): Promise<EmployeeSkill> {
    await this.employeeSkillRepo.update(id, partial);
    return this.findEmployeeSkillById(id) as Promise<EmployeeSkill>;
  }

  async removeEmployeeSkill(id: string): Promise<void> {
    await this.employeeSkillRepo.delete(id);
  }

  async findEmployeesBySkillName(
    skillName: string,
  ): Promise<EmployeeSkill[]> {
    return this.employeeSkillRepo
      .createQueryBuilder('es')
      .innerJoinAndSelect('es.skill', 'skill')
      .innerJoinAndSelect('es.employee', 'employee')
      .where('LOWER(skill.name) LIKE LOWER(:name)', {
        name: `%${skillName}%`,
      })
      .orderBy('es.level', 'DESC')
      .addOrderBy('es.yearsOfExperience', 'DESC')
      .getMany();
  }

  // ─── Employee Projects ───

  async findEmployeeProject(
    employeeId: string,
    projectId: string,
  ): Promise<EmployeeProject | null> {
    return this.employeeProjectRepo.findOne({
      where: { employeeId, projectId, releasedDate: IsNull() },
      relations: ['project', 'employee'],
    });
  }

  async findEmployeeProjectById(id: string): Promise<EmployeeProject | null> {
    return this.employeeProjectRepo.findOne({
      where: { id },
      relations: ['project', 'employee'],
    });
  }

  async createEmployeeProject(
    partial: Partial<EmployeeProject>,
  ): Promise<EmployeeProject> {
    const ep = this.employeeProjectRepo.create(partial);
    return this.employeeProjectRepo.save(ep);
  }

  async updateEmployeeProject(
    id: string,
    partial: Partial<EmployeeProject>,
  ): Promise<EmployeeProject> {
    await this.employeeProjectRepo.update(id, partial);
    return this.findEmployeeProjectById(id) as Promise<EmployeeProject>;
  }

  async removeEmployeeProject(id: string): Promise<void> {
    await this.employeeProjectRepo.delete(id);
  }

  // ─── Resource Planning ───

  async findAllActiveAllocations(): Promise<EmployeeProject[]> {
    return this.employeeProjectRepo.find({
      where: { releasedDate: IsNull() },
      relations: ['employee', 'project'],
      order: { employeeId: 'ASC' },
    });
  }

  // ─── Skill-Based Project Matching ───

  async findEmployeesWithSkills(
    skillIds: string[],
  ): Promise<EmployeeSkill[]> {
    if (skillIds.length === 0) return [];

    return this.employeeSkillRepo
      .createQueryBuilder('es')
      .innerJoinAndSelect('es.employee', 'employee')
      .innerJoinAndSelect('es.skill', 'skill')
      .leftJoinAndSelect('employee.employeeProjects', 'ep', 'ep.released_date IS NULL')
      .where('es.skill_id IN (:...skillIds)', { skillIds })
      .orderBy('es.level', 'DESC')
      .addOrderBy('es.yearsOfExperience', 'DESC')
      .getMany();
  }
}
