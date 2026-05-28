// dto/submit-quiz.dto.ts
export class SubmitQuizDto {
  examSessionId: number;
  answers: { questionText: string; selectedOption: string }[];

  constructor(body: any) {
    if (!body.examSessionId) throw new Error('examSessionId is required');
    if (!Array.isArray(body.answers) || body.answers.length === 0)
      throw new Error('answers must be a non-empty array');
    this.examSessionId = Number(body.examSessionId);
    this.answers       = body.answers;
  }
}