import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.passwordHash, 10);
    return this.usersRepository.create({
      ...dto,
      passwordHash: hashedPassword,
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id); // Ensure user exists

    const updateData: Partial<User> = { ...dto };
    if (dto.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(dto.passwordHash, 10);
    }

    return this.usersRepository.update(id, updateData);
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
