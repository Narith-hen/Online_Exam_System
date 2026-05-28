// Result.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ExamSession } from './ExamSession.entity';
import { Student } from './student.entity';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn()
  resultId!: number;

  @Column()
  examSessionId!: number;

  @Column()
  studentId!: number;

  @Column('float')
  percentAge!: number;

  @Column()
  totalScore!: number;

  @Column()
  isPassed!: boolean;

  @Column({ type: 'varchar', length: 10 })
  grade!: string;

  @ManyToOne(() => ExamSession, (session) => session.results)
  examSession!: ExamSession;

  @ManyToOne(() => Student, (student) => student.results)
  student!: Student;

  @CreateDateColumn()
  createdAt!: Date;
}