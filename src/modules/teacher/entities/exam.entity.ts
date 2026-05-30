import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ExamStatus } from '../../../constants/exam-status.enum';
import { QuestionEntity } from './question.entity';

@Entity('exams')
export class ExamEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'int', name: 'duration_minutes', nullable: true })
  durationMinutes?: number | null;

  @Column({ type: 'enum', enum: ExamStatus, default: ExamStatus.DRAFT })
  status!: ExamStatus;

  @OneToMany(() => QuestionEntity, (q) => q.exam)
  questions?: QuestionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

