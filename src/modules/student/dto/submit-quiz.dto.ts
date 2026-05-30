// dto/submit-quiz.dto.ts
export class SubmitQuizDto {
  examSessionId: string;
  answers: { questionId: string; studentAnswer: string; isCorrect: boolean; answerText: string }[];

  constructor(body: any) {
    if (!body.examSessionId) throw new Error('examSessionId is required');
    if (!Array.isArray(body.answers) || body.answers.length === 0)
      throw new Error('answers must be a non-empty array');
    this.examSessionId = body.examSessionId;
    this.answers       = body.answers;
  }
}