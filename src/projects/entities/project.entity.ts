import { EmployeeProject } from 'src/assignments/entities/employee-project.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export enum ProjectStatus {
  Planning = 'planning',
  Active = 'active',
  Completed = 'completed',
  Paused = 'paused',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Client, (client) => client.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ enum: ProjectStatus, default: ProjectStatus.Planning })
  status: ProjectStatus;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  budget: number;

  @OneToMany(
    () => EmployeeProject,
    (employeeProject) => employeeProject.project,
    { cascade: true, eager: true },
  )
  employeeProjects: EmployeeProject[];

  @OneToMany(() => Sprint, (sprint) => sprint.project)
  sprints: Sprint[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
