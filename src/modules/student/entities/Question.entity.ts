import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exam } from './Exam.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column()
  optionA!: string;

  @Column()
  optionB!: string;

  @Column()
  optionC!: string;

  @Column()
  optionD!: string;

  @Column()
  correctAnswer!: string;

  @ManyToOne(() => Exam, (exam) => exam.questions)
  exam!: Exam;
}