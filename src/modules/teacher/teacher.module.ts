// src/teacher/teacher.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Exam } from "./entities/exam.entity";
import { Question } from "./entities/question.entity";
import { TeacherController } from "./controllers/teacherExam.controller";
import { TeacherService } from "./services/teacherExam.service";

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Question])],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}