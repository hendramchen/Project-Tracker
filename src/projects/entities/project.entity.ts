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
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  clientId: string;

  @Column()
  startDate: Date;

  @Column()
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
