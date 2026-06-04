// entities/Student.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  fullname!: string;

  @Column({ type: 'varchar', length: 50 })
  class!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'boolean', default: false })
  isLoggedIn!: boolean;

  @OneToMany('ExamSession', 'student')
  sessions!: any[];

  @OneToMany('Result', 'student')
  results!: any[];
}