import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExamEntity } from './exam.entity';
import { Answer } from './answer.entity';

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

  @Column({ type: 'boolean', default: true })
  isRequired: boolean;

  @ManyToOne(() => ExamEntity, (exam) => exam.questions)
  @JoinColumn({ name: 'examId', referencedColumnName: 'examId' })
  exam: ExamEntity;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}