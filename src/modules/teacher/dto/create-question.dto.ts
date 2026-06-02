// src/teacher/dto/create-question.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  options: string[];

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;
}