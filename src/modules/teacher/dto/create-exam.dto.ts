// src/teacher/dto/create-exam.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class CreateExamDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  examTitle?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @IsOptional()
  @IsDateString()
  startWindow?: string;

  @IsOptional()
  @IsDateString()
  endWindow?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalMarks?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  passingScore?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  createdBy?: string;
}
