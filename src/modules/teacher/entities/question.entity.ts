// question.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exam } from "./exam.entity";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "question_text" })
  questionText!: string;

  @Column("simple-array")
  options!: string[];

  @Column({ name: "correct_answer" })
  correctAnswer!: string;

  @Column({ name: "exam_id" })
  examId!: number;

  @ManyToOne(() => Exam, (exam) => exam.questions)
  exam!: Exam;
}