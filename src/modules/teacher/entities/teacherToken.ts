import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('teacher_tokens')
export class TeacherToken {
  @PrimaryGeneratedColumn('uuid')
  tokenId: string;

  @Column({ type: 'char', length: 36 })
  teacherId: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId', referencedColumnName: 'userId' })
  teacher: User;
}