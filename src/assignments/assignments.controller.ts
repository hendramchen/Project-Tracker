import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignEmployeeSkillDto } from './dto/assign-employee-skill.dto';
import { UpdateEmployeeSkillDto } from './dto/update-employee-skill.dto';
import { AssignEmployeeProjectDto } from './dto/assign-employee-project.dto';
import { UpdateEmployeeProjectDto } from './dto/update-employee-project.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles, Role } from 'src/common/decorators/roles.decorator';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // ─── Employee Skills ───

  @Post('employee-skills')
  @Roles(Role.Admin)
  assignSkill(@Body() dto: AssignEmployeeSkillDto) {
    return this.assignmentsService.assignSkillToEmployee(dto);
  }

  @Patch('employee-skills/:id')
  @Roles(Role.Admin)
  updateSkillAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeSkillDto,
  ) {
    return this.assignmentsService.updateEmployeeSkill(id, dto);
  }

  @Delete('employee-skills/:id')
  @Roles(Role.Admin)
  removeSkillAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentsService.removeEmployeeSkill(id);
  }

  @Get('search-by-skill')
  searchBySkill(@Query('skill') skillName: string) {
    return this.assignmentsService.findEmployeesBySkill(skillName);
  }

  // ─── Employee Projects ───

  @Post('employee-projects')
  @Roles(Role.Admin)
  assignProject(@Body() dto: AssignEmployeeProjectDto) {
    return this.assignmentsService.assignEmployeeToProject(dto);
  }

  @Patch('employee-projects/:id')
  @Roles(Role.Admin)
  updateProjectAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeProjectDto,
  ) {
    return this.assignmentsService.updateEmployeeProject(id, dto);
  }

  @Delete('employee-projects/:id')
  @Roles(Role.Admin)
  removeProjectAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentsService.removeEmployeeProject(id);
  }

  // ─── Resource Planning ───

  @Get('utilization')
  getUtilization() {
    return this.assignmentsService.getUtilization();
  }

  // ─── Skill-Based Project Matching ───

  @Post('suggest-employees')
  @Roles(Role.Admin)
  suggestEmployees(@Body('skillIds') skillIds: string[]) {
    return this.assignmentsService.suggestEmployeesForProject(skillIds);
  }
}
