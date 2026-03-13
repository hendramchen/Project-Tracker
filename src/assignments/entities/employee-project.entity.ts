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
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Project, (project) => project.employeeProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ enum: EmployeeProjectRole, default: EmployeeProjectRole.Developer })
  role: EmployeeProjectRole;

  @Column({
    name: 'allocation_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 100,
  })
  allocationPercentage: number;

  @Column({ name: 'assigned_date' })
  assignedDate: Date;

  @Column({ name: 'released_date', nullable: true })
  releasedDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
