import { EmployeeProject } from 'src/assignments/entities/employee-project.entity';
import { EmployeeSkill } from 'src/assignments/entities/employee-skill.entity';
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
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ name: 'start_working_date' })
  startWorkingDate: Date;

  @Column()
  position: string;

  @Column({ name: 'team_location' })
  teamLocation: string;

  @Column({
    name: 'employment_status',
    enum: EmploymentStatus,
    default: EmploymentStatus.Active,
  })
  employmentStatus: EmploymentStatus;

  @Column()
  phone: string;

  @Column()
  address: string;

  @OneToMany(
    () => EmployeeProject,
    (employeeProject) => employeeProject.employee,
  )
  employeeProjects: EmployeeProject[];

  @OneToMany(() => EmployeeSkill, (employeeSkill) => employeeSkill.employee)
  employeeSkills: EmployeeSkill[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
