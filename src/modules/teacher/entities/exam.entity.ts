// src/teacher/entities/exam.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Question } from "./question.entity";

@Entity("exams")
export class Exam {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "exam_title" })
  examTitle!: string;

  @Column({ name: "exam_code", unique: true })
  examCode!: string;

  @Column({ name: "teacher_id", nullable: true })
  teacherId!: number;

  @OneToMany(() => Question, (q) => q.exam, {
    cascade: true,
    eager: true,
  })
  questions!: Question[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}