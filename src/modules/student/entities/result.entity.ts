// entities/Result.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  resultId!: string;

  @Column({ type: 'int' })
  studentId!: number;

  @Column({ type: 'char', length: 36 })
  examSessionId!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentAge!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  totalScore!: number;

  @Column({ type: 'tinyint' })
  isPassed!: boolean;

  @Column({ type: 'varchar', length: 10 })
  grade!: string;

  @ManyToOne('ExamSession', 'results')
  @JoinColumn({ name: 'examSessionId' })
  session!: any;

  @ManyToOne('Student', 'results')
  @JoinColumn({ name: 'studentId' })
  student!: any;

  @CreateDateColumn()
  createAt!: Date;
}