import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { Exam } from './Exam.entity';
import { Answer } from './Answer.entity';
import { Result } from './Result.entity';

@Entity('exam_sessions')
export class ExamSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 'in_progress' })
  status!: string;

  @Column()
  studentId!: number;

  @Column()
  examId!: number;

  @ManyToOne(() => Student, (student) => student.sessions)
  student!: Student;

  @ManyToOne(() => Exam, (exam) => exam.sessions)
  exam!: Exam;

  @OneToMany(() => Answer, (answer) => answer.session)
  answers!: Answer[];

  @OneToMany(() => Result, (result) => result.examSession)
  results!: Result[];

  @CreateDateColumn()
  createdAt!: Date;
}