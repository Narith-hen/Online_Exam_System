// src/teacher/dto/create-exam.dto.ts
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  examTitle: string;
}