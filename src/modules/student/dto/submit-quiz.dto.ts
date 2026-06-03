// dto/submit-quiz.dto.ts
export class SubmitQuizDto {
  examSessionId: string;
  answers: { questionId: string; studentAnswer?: string; optionId?: string }[];

  constructor(body: any) {
    if (!body.examSessionId) throw new Error('examSessionId is required');
    if (!Array.isArray(body.answers) || body.answers.length === 0)
      throw new Error('answers must be a non-empty array');

    // Validate each answer: require questionId and at least one of studentAnswer or optionId
    for (const answer of body.answers) {
      if (!answer.questionId) throw new Error('questionId is required for each answer');
      if ((answer.studentAnswer === undefined || answer.studentAnswer === null) && !answer.optionId) {
        throw new Error('either studentAnswer or optionId is required for each answer');
      }
    }

    this.examSessionId = body.examSessionId;
    this.answers = body.answers.map((a: any) => ({
      questionId: a.questionId,
      studentAnswer: a.studentAnswer !== undefined && a.studentAnswer !== null ? String(a.studentAnswer) : undefined,
      optionId: a.optionId !== undefined ? String(a.optionId) : undefined,
    }));
  }
}