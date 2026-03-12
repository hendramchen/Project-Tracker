import { Injectable } from '@nestjs/common';
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
    return this.employeesRepository.findById(id);
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesRepository.update(id, updateEmployeeDto);
  }
}
