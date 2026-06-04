// entities/ExamSession.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';

@Entity()
@Unique(['studentId']) //THIS is what blocks duplicate sessions at DB level
export class ExamSession {
  @PrimaryGeneratedColumn('uuid')
  examSessionId: string;

  @Column()
  studentId: number;

  @Column()
  examId: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  submittedAt: Date;

  @Column({ nullable: true })
  deviceFingerPrint: string;
}