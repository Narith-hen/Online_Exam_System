import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ExamStatus } from '../../../constants/exam-status.enum';
import { Question } from './question.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'exam_title', type: 'varchar', length: 255 })
  examTitle!: string;

  @Column({ name: 'exam_code', type: 'varchar', length: 12, unique: true })
  examCode!: string;

  @Column({ type: 'int', name: 'duration_minutes', nullable: true })
  durationMinutes?: number | null;

  @Column({ type: 'enum', enum: ExamStatus, default: ExamStatus.DRAFT })
  status!: ExamStatus;

  @OneToMany(() => Question, (q) => q.exam)
  questions?: Question[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

