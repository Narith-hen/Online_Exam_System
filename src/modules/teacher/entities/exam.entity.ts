import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity('exams')
export class ExamEntity {
  @PrimaryGeneratedColumn('uuid')
  examId: string;

  @Column({ type: 'char', length: 36 })
  createdBy: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ type: 'datetime' })
  startWindow: Date;

  @Column({ type: 'datetime' })
  endWindow: Date;

  @Column({ type: 'int', default: 0 })
  totalMarks: number;

  @Column({ type: 'int' })
  passingScore: number;

  @Column({ type: 'tinyint', default: 0 })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  examCode: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  examLink: string | null;

  @OneToMany(() => QuestionEntity, (question) => question.exam, {
    cascade: true,
  })
  questions: QuestionEntity[];
}
