import { IsEnum, IsString } from 'class-validator';
import { SkillCategory } from '../entities/skill.entity';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(SkillCategory)
  category: SkillCategory;
}
