import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(partial: Partial<User>): Promise<User> {
    const user = this.repo.create(partial);
    return this.repo.save(user);
  }

  async update(id: string, partial: Partial<User>): Promise<User> {
    await this.repo.update(id, partial);
    return this.findById(id) as Promise<User>;
  }
}
