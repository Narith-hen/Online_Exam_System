export class AnswerDto {
  questionId: number;
  selectedAnswer: string;

  constructor(data: any) {
    this.questionId     = data.questionId;
    this.selectedAnswer = data.selectedAnswer;
  }
}

export class SubmitQuizDto {
  sessionId: number;
  answers: AnswerDto[];

  constructor(data: any) {
    this.sessionId = data.sessionId;
    this.answers   = (data.answers || []).map((a: any) => new AnswerDto(a));
  }

  validate(): void {
    if (!this.sessionId)          throw new Error('sessionId is required');
    if (!this.answers.length)     throw new Error('answers are required');
  }
}