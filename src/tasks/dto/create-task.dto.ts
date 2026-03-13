import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsUUID()
  sprintId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  assigneeEmployeeId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  storyPoints?: number;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
