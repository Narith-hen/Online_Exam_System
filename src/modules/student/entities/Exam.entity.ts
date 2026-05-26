import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Question } from './Question.entity';
import { ExamSession } from './ExamSession.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Question, (q) => q.exam, { cascade: true, onDelete: 'CASCADE' })
  questions!: Question[];

  @OneToMany(() => ExamSession, (s) => s.exam, { cascade: true, onDelete: 'CASCADE' })
  sessions!: ExamSession[];
}