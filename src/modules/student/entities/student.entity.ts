// student.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ExamSession } from './ExamSession.entity';
import { Result } from './Result.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullname!: string;

  @Column()
  class!: string;

  @Column({ unique: true })
  email!: string;

  @OneToMany(() => ExamSession, (session) => session.student)
  sessions!: ExamSession[];

  @OneToMany(() => Result, (result) => result.student)
  results!: Result[];
}