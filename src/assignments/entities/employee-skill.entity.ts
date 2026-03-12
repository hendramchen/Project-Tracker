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
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Skill)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @Column({ name: 'skill_id' })
  skillId: string;

  @Column({ type: 'enum', enum: SkillLevel, default: SkillLevel.Beginner })
  level: SkillLevel;

  @Column({ name: 'years_of_experience', type: 'int', default: 0 })
  yearsOfExperience: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
