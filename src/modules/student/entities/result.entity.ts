import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ExamSession } from './ExamSession.entity';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullname!: string;

  @Column()
  email!: string;

  @Column()
  score!: number;

  @Column()
  totalQuestions!: number;

  @Column()
  percentage!: number;

  @Column({ default: false })
  passed!: boolean;

  @CreateDateColumn()
  submittedAt!: Date;

  @ManyToOne(() => ExamSession, (s) => s.results)
  session!: ExamSession;
}