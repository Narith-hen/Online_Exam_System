import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionType } from '../../../constants/question-type.enum';
import { ExamEntity } from './exam.entity';

@Entity('questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'exam_id' })
  examId!: string;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'enum', enum: QuestionType })
  type!: QuestionType;

  @Column({ type: 'int', default: 1 })
  points!: number;

  @Column({ name: 'correct_answer', type: 'text', nullable: true })
  correctAnswer?: string | null;

  @ManyToOne(() => ExamEntity, (exam) => exam.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam!: ExamEntity;

  @OneToMany(() => QuestionOptionEntity, (opt) => opt.question, { cascade: true })
  options?: QuestionOptionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

@Entity('question_options')
export class QuestionOptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'question_id' })
  questionId!: string;

  @Column({ type: 'text' })
  text!: string;

  @Column({ name: 'is_correct', type: 'boolean', default: false })
  isCorrect!: boolean;

  @ManyToOne(() => QuestionEntity, (q) => q.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: QuestionEntity;
}

