import { Project } from 'src/projects/entities/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  industry: string;

  @Column({ name: 'contact_email', unique: true })
  contactEmail: string;

  @Column({ name: 'contact_phone' })
  contactPhone: string;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
