import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  answerId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column()
  questionId: string;

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'questionId', referencedColumnName: 'questionId' })
  question: QuestionEntity;

  @CreateDateColumn()
  createdAt: Date;
}
