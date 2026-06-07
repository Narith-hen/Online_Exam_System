import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['studentId']) //THIS is what blocks duplicate sessions at DB level
export class ExamSession {
  @PrimaryGeneratedColumn('uuid', { name: 'examSessionId' })
  examSessionId!: string;

  @Column({ name: 'examId', type: 'char', length: 36 })
  examId!: string;

  @Column({ name: 'studentId', type: 'int' })
  studentId!: number;

  @Column({ name: 'deviceFingerPrint', type: 'varchar', length: 255, nullable: true })
  deviceFingerPrint!: string;

  @Column({ type: 'enum', enum: ['pending', 'in_progress', 'submitted', 'expired'], default: 'pending' })
  status!: string;

  @Column({ name: 'startedAt', nullable: true })
  startedAt!: Date;

  @Column({ name: 'expiresAt', nullable: true })
  expiresAt!: Date;

  @Column({ name: 'submittedAt', nullable: true })
  submittedAt!: Date;
}