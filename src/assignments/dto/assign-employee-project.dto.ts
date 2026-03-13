import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { EmployeeProjectRole } from '../entities/employee-project.entity';

export class AssignEmployeeProjectDto {
  @IsUUID()
  employeeId: string;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsEnum(EmployeeProjectRole)
  role?: EmployeeProjectRole;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  allocationPercentage?: number;

  @IsDateString()
  assignedDate: Date;

  @IsOptional()
  @IsDateString()
  releasedDate?: Date;
}
