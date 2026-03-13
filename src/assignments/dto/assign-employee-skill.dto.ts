import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { SkillLevel } from '../entities/employee-skill.entity';

export class AssignEmployeeSkillDto {
  @IsUUID()
  employeeId: string;

  @IsUUID()
  skillId: string;

  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;
}
