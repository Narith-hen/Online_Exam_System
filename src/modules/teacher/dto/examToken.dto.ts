// ─── Exam ──────────────────────────────────────────────────────────────────
export interface CreateExamDto {
  title      : string;
  description?: string;
  duration   ?: number;
}

export interface UpdateExamDto {
  title      ?: string;
  description?: string;
  duration   ?: number;
  isPublished?: boolean;
}

// ─── Question ──────────────────────────────────────────────────────────────
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE      = 'true_false',
  SHORT_ANSWER    = 'short_answer',
}

export interface CreateQuestionDto {
  questionText  : string;
  questionType  ?: QuestionType;
  questionOptions?: string;
  correctAnswer : string;
  marks         ?: number;
  isRequired    ?: boolean;
}

export interface UpdateQuestionDto {
  questionText  ?: string;
  questionType  ?: QuestionType;
  questionOptions?: string;
  correctAnswer ?: string;
  marks         ?: number;
  isRequired    ?: boolean;
}

// ─── Answer ────────────────────────────────────────────────────────────────
export interface CreateAnswerDto {
  content  : string;
  isCorrect?: boolean;
}

export interface UpdateAnswerDto {
  content  ?: string;
  isCorrect?: boolean;
}
