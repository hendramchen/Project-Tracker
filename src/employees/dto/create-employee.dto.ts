import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EmploymentStatus } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsUUID()
  userId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsDateString()
  startWorkingDate: Date;

  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  teamLocation?: string;

  @IsOptional()
  @IsEnum(EmploymentStatus)
  employmentStatus?: EmploymentStatus;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
