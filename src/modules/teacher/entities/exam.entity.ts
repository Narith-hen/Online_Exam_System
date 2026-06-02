import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Question } from "./question.entity";

@Entity("exams")
export class Exam {
  @PrimaryColumn({ name: "examId", type: "varchar", length: 36 })
  examId!: string;

  @Column({ name: "createdBy", type: "varchar", length: 36, nullable: true })
  createdBy!: string | null;

  @Column({ name: "title" })
  examTitle!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "durationMinutes", type: "int", default: 60 })
  durationMinutes!: number;

  @Column({ name: "startWindow", type: "datetime", nullable: true })
  startWindow!: Date | null;

  @Column({ name: "endWindow", type: "datetime", nullable: true })
  endWindow!: Date | null;

  @Column({ name: "totalMarks", type: "int", default: 100 })
  totalMarks!: number;

  @Column({ name: "passingScore", type: "int", default: 50 })
  passingScore!: number;

  @Column({ name: "isPublished", type: "boolean", default: false })
  isPublished!: boolean;

  @Column({ name: "examCode", unique: true })
  examCode!: string;

  @Column({ name: "examLink", type: "varchar", length: 255, nullable: true })
  examLink!: string | null;

  @Column({ name: "accessCode", type: "varchar", length: 20, unique: true, nullable: true })
  accessCode!: string | null;

  @OneToMany(() => Question, (question) => question.exam)
  questions!: Question[];

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
