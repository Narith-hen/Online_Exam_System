// question.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
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

  @Column({ name: "examId" })
  examId!: string;

  @ManyToOne(() => Exam, (exam) => exam.questions)
  @JoinColumn({ name: "examId", referencedColumnName: "examId" })
  exam!: Exam;
}
