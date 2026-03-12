import { Injectable } from '@nestjs/common';
import { Employee } from './entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Employee | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(partial: Partial<Employee>): Promise<Employee> {
    const employee = this.repo.create(partial);
    return this.repo.save(employee);
  }

  async update(id: string, partial: Partial<Employee>): Promise<Employee> {
    await this.repo.update(id, partial);
    return this.findById(id) as Promise<Employee>;
  }
}
