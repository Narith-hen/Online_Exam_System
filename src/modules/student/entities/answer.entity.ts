import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from './Question.entity';
import { ExamSession } from './ExamSession.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question!: Question;

  @Column()
  selectedAnswer!: string;

  @Column({ default: false })
  isCorrect!: boolean;

  @ManyToOne(() => ExamSession, (s) => s.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session!: ExamSession;
}