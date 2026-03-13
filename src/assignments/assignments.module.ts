import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeSkill } from './entities/employee-skill.entity';
import { EmployeeProject } from './entities/employee-project.entity';
import { AssignmentsRepository } from './assignments.repository';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeSkill, EmployeeProject])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, AssignmentsRepository],
  exports: [AssignmentsService, AssignmentsRepository],
})
export class AssignmentsModule {}
