import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Exam } from './Exam.entity';
import { Answer } from './Answer.entity';
import { Result } from './Result.entity';

export enum SessionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('exam_sessions')
export class ExamSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullname!: string;

  @Column()
  email!: string;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.IN_PROGRESS })
  status!: SessionStatus;

  @CreateDateColumn()
  startedAt!: Date;

  @Column({ nullable: true })
  completedAt!: Date;

  @ManyToOne(() => Exam, (exam) => exam.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam!: Exam;

  @OneToMany(() => Answer, (a) => a.session, { cascade: true, onDelete: 'CASCADE' })
  answers!: Answer[];

  @OneToMany(() => Result, (r) => r.session, { cascade: true, onDelete: 'CASCADE' })
  results!: Result[];
}