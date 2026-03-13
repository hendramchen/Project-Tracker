import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsRepository } from './skills.repository';

@Injectable()
export class SkillsService {
  constructor(private readonly skillsRepository: SkillsRepository) {}

  async create(dto: CreateSkillDto) {
    const existing = await this.skillsRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('Skill with this name already exists');
    }
    return this.skillsRepository.create(dto);
  }

  async findAll() {
    return this.skillsRepository.findAll();
  }

  async findById(id: string) {
    const skill = await this.skillsRepository.findById(id);
    if (!skill) {
      throw new NotFoundException(`Skill with ID "${id}" not found`);
    }
    return skill;
  }

  async update(id: string, dto: UpdateSkillDto) {
    await this.findById(id);
    return this.skillsRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findById(id);
    return this.skillsRepository.delete(id);
  }
}
