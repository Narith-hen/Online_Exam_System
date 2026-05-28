// Answer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ExamSession } from './ExamSession.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  questionText!: string;

  @Column()
  selectedOption!: string;

  @Column()
  examSessionId!: number;

  @ManyToOne(() => ExamSession, (session) => session.answers)
  session!: ExamSession;
}