import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { SkillLevel } from '../entities/employee-skill.entity';

export class UpdateEmployeeSkillDto {
  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;
}
