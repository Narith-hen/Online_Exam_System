import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity('exams')
export class ExamEntity {
  @PrimaryGeneratedColumn('uuid')
  examId: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  createdBy: string | null;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 60 })
  durationMinutes: number;

  @Column({ type: 'datetime', nullable: true })
  startWindow: Date | null;

  @Column({ type: 'datetime', nullable: true })
  endWindow: Date | null;

  @Column({ type: 'int', default: 100 })
  totalMarks: number;

  @Column({ type: 'int', default: 50 })
  passingScore: number;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  examCode: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  examLink: string | null;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  accessCode: string | null;

  @OneToMany(() => QuestionEntity, (question) => question.exam, {
    cascade: true,
  })
  questions: QuestionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}