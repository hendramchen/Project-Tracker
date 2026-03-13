import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles, Role } from 'src/common/decorators/roles.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOne(id);
  }

  @Get(':id/profile')
  getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.getProfile(id);
  }

  @Get(':id/skills')
  getSkills(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.getSkills(id);
  }

  @Get(':id/projects')
  getProjects(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.getProjects(id);
  }

  @Get(':id/workload')
  getWorkload(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.getWorkload(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }
}
