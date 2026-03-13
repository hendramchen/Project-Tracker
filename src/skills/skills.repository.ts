import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsRepository {
  constructor(
    @InjectRepository(Skill) private readonly repo: Repository<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Skill | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Skill | null> {
    return this.repo.findOne({ where: { name } });
  }

  async create(partial: Partial<Skill>): Promise<Skill> {
    const skill = this.repo.create(partial);
    return this.repo.save(skill);
  }

  async update(id: string, partial: Partial<Skill>): Promise<Skill> {
    await this.repo.update(id, partial);
    return this.findById(id) as Promise<Skill>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
