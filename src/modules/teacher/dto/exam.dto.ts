import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from './question.dto';
 
export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;
 
  @IsOptional()
  @IsString()
  description?: string;
 
  @IsInt()
  @Min(1)
  durationMinutes: number;
 
  @IsDateString()
  startWindow: string;
 
  @IsDateString()
  endWindow: string;
 
  @IsInt()
  @Min(1)
  passingScore: number;
 
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = false;
 
  @IsOptional()
  @IsString()
  @MaxLength(50)
  examCode?: string;
 
  @IsOptional()
  @IsString()
  @MaxLength(500)
  examLink?: string;
 
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
