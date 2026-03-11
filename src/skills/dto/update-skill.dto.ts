import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SkillCategory } from '../entities/skill.entity';

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(SkillCategory)
  category?: SkillCategory;
}
