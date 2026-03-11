import { Employee } from 'src/employees/entities/employee.entity';
import { Project } from 'src/projects/entities/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum EmployeeProjectRole {
  Developer = 'developer',
  TechLead = 'tech_lead',
  PM = 'pm',
  QA = 'qa',
}

@Entity('employee_projects')
export class EmployeeProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee, (employee) => employee.employeeProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column('uuid')
  employeeId: string;

  @ManyToOne(() => Project, (project) => project.employeeProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column('uuid')
  projectId: string;

  @Column({ enum: EmployeeProjectRole, default: EmployeeProjectRole.Developer })
  role: EmployeeProjectRole;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  allocationPercentage: number;

  @Column()
  assignedDate: Date;

  @Column()
  releasedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
