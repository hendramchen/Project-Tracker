import { Sprint } from 'src/sprints/entities/sprint.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum TaskStatus {
  ToDo = 'todo',
  InProgress = 'in_progress',
  Done = 'done',
}
export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => Sprint, (sprint) => sprint.tasks)
  @JoinColumn({ name: 'sprint_id' })
  sprint: Sprint;

  @Column({ name: 'sprint_id' })
  sprintId: string;

  @Column({ enum: TaskStatus, default: TaskStatus.ToDo })
  status: TaskStatus;

  @Column({ name: 'assignee_employee_id', nullable: true })
  assigneeEmployeeId: string;

  @Column({ name: 'story_points', type: 'int', default: 0 })
  storyPoints: number;

  @Column({ enum: TaskPriority, default: TaskPriority.Medium })
  priority: TaskPriority;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
