import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SprintStatus } from '../entities/sprint.entity';

export class CreateSprintDto {
  @IsUUID()
  projectId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsEnum(SprintStatus)
  status?: SprintStatus;
}
