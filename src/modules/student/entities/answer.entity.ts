// entities/Answer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  answerId!: string;

  @Column({ type: 'char', length: 36 })
  examSessionId!: string;

  @Column({ type: 'int' })
  studentId!: number;

  @Column({ type: 'char', length: 36 })
  questionId!: string;

  @Column({ type: 'text', nullable: true })
  studentAnswer!: string;

  @Column({ type: 'text', nullable: true })
  answerText?: string; // Correct answer (stored by server for reference)

  @Column({ type: 'tinyint', default: 0, nullable: true })
  isCorrect?: boolean; // Whether answer is correct (graded by server)

  @ManyToOne('ExamSession', 'answers')
  @JoinColumn({ name: 'examSessionId' })
  session!: any;
}