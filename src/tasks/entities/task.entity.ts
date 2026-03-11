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
  @JoinColumn({ name: 'sprintId' })
  sprint: Sprint;

  @Column()
  sprintId: string;

  @Column({ enum: TaskStatus, default: TaskStatus.ToDo })
  status: TaskStatus;

  @Column()
  assigneeEmployeeId: string;

  @Column()
  storyPoints: number;

  @Column({ enum: TaskPriority, default: TaskPriority.Medium })
  priority: TaskPriority;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
