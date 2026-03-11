import { EmployeeProject } from 'src/assignments/entities/employee-project.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

export enum EmploymentStatus {
  Active = 'active',
  Resigned = 'resigned',
  Contract = 'contract',
}
@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  startWorkingDate: Date;

  @Column()
  position: string;

  @Column()
  teamLocation: string;

  @Column({ enum: EmploymentStatus, default: EmploymentStatus.Active })
  employmentStatus: EmploymentStatus;

  @Column()
  phone: string;

  @Column()
  address: string;

  @OneToMany(
    () => EmployeeProject,
    (employeeProject) => employeeProject.employee,
    { cascade: true, eager: true },
  )
  employeeProjects: EmployeeProject[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
