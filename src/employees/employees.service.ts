import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.repository';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepository: EmployeesRepository) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.employeesRepository.create(createEmployeeDto);
  }

  async findAll() {
    return this.employeesRepository.findAll();
  }

  async findOne(id: string) {
    const employee = await this.employeesRepository.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findOne(id);
    return this.employeesRepository.update(id, updateEmployeeDto);
  }

  async getProfile(id: string) {
    const employee = await this.employeesRepository.findByIdWithFullProfile(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }
    return employee;
  }

  async getSkills(id: string) {
    const employee = await this.employeesRepository.findByIdWithSkills(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }
    return employee.employeeSkills;
  }

  async getProjects(id: string) {
    const employee = await this.employeesRepository.findByIdWithProjects(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }
    return employee.employeeProjects;
  }

  async getWorkload(id: string) {
    const employee = await this.employeesRepository.findByIdWithProjects(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }

    const activeProjects = (employee.employeeProjects || []).filter(
      (ep) => !ep.releasedDate,
    );

    const totalAllocation = activeProjects.reduce(
      (sum, ep) => sum + Number(ep.allocationPercentage),
      0,
    );

    return {
      employeeId: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      position: employee.position,
      totalAllocation,
      available: Math.max(0, 100 - totalAllocation),
      projects: activeProjects.map((ep) => ({
        projectId: ep.projectId,
        projectName: ep.project?.name,
        role: ep.role,
        allocationPercentage: Number(ep.allocationPercentage),
      })),
    };
  }
}
