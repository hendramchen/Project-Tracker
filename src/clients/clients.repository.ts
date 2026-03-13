import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Client | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdWithProjects(id: string): Promise<Client | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['projects', 'projects.employeeProjects', 'projects.employeeProjects.employee'],
    });
  }

  async create(partial: Partial<Client>): Promise<Client> {
    const client = this.repo.create(partial);
    return this.repo.save(client);
  }

  async update(id: string, partial: Partial<Client>): Promise<Client> {
    await this.repo.update(id, partial);
    return this.findById(id) as Promise<Client>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
