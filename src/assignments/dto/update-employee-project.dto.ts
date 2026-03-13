import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { EmployeeProjectRole } from '../entities/employee-project.entity';

export class UpdateEmployeeProjectDto {
  @IsOptional()
  @IsEnum(EmployeeProjectRole)
  role?: EmployeeProjectRole;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  allocationPercentage?: number;

  @IsOptional()
  @IsDateString()
  releasedDate?: Date;
}
