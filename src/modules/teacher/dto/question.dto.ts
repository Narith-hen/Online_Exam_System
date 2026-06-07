import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsString()
  @IsIn(['multiple_choice', 'true_false', 'short_answer'])
  questionType: string;

  @IsOptional()
  @IsString()
  questionOptions?: string;

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsInt()
  @Min(1)
  marks: number;

  @IsOptional()
  isRequired?: boolean;
}
