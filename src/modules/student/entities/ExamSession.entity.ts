// entities/ExamSession.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('examsession')
export class ExamSession {
  @PrimaryGeneratedColumn('uuid')
  examSessionId!: string;

  @Column({ type: 'char', length: 36 })
  examId!: string;

  @Column({ type: 'int' })
  studentId!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceFingerPrint!: string;

  @Column({ type: 'enum', enum: ['pending', 'in_progress', 'submitted', 'expired'], default: 'pending' })
  status!: string;

  @Column({ nullable: true })
  startedAt!: Date;

  @Column({ nullable: true })
  expiresAt!: Date;

  @Column({ nullable: true })
  submittedAt!: Date;

  @OneToMany('Answer', 'session')
  answers!: any[];

  @OneToMany('Result', 'session')
  results!: any[];
}