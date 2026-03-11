import { Employee } from 'src/employees/entities/employee.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum SkillLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Expert = 'expert',
}

@Entity('employee_skills')
export class EmployeeSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @ManyToOne(() => Skill)
  @JoinColumn({ name: 'skillId' })
  skill: Skill;

  @Column()
  skillId: string;

  @Column({ type: 'enum', enum: SkillLevel, default: SkillLevel.Beginner })
  level: SkillLevel;

  @Column()
  yearsOfExperience: number;

  @CreateDateColumn()
  createdAt: Date;
}
