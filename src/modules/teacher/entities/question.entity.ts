import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExamEntity } from './exam.entity';

@Entity('questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  questionId: string;

  @Column({ type: 'char', length: 36 })
  examId: string;

  @Column({ type: 'text' })
  questionText: string;

  @Column({ type: 'varchar', length: 50 })
  questionType: string;

  @Column({ type: 'longtext', nullable: true })
  questionOptions: string | null;

  @Column({ type: 'varchar', length: 255 })
  correctAnswer: string;

  @Column({ type: 'int' })
  marks: number;

  @ManyToOne(() => ExamEntity, (exam) => exam.questions)
  @JoinColumn({ name: 'examId', referencedColumnName: 'examId' })
  exam: ExamEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}