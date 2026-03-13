import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientsRepository } from './clients.repository';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async create(dto: CreateClientDto) {
    return this.clientsRepository.create(dto);
  }

  async findAll() {
    return this.clientsRepository.findAll();
  }

  async findOne(id: string) {
    const client = await this.clientsRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }
    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id);
    return this.clientsRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.clientsRepository.delete(id);
  }

  async getDashboard(id: string) {
    const client = await this.clientsRepository.findByIdWithProjects(id);
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }
    return {
      id: client.id,
      name: client.name,
      country: client.country,
      industry: client.industry,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      projects: (client.projects || []).map((project) => ({
        id: project.id,
        name: project.name,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        employees: (project.employeeProjects || []).map((ep) => ({
          employeeId: ep.employeeId,
          name: `${ep.employee.firstName} ${ep.employee.lastName}`,
          role: ep.role,
          allocationPercentage: Number(ep.allocationPercentage),
        })),
      })),
    };
  }
}
