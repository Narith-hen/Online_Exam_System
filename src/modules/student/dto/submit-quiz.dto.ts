export class SubmitQuizDto {
  examSessionId: string;
  answers: {
    questionId:    string;
    studentAnswer: string;
  }[];

  constructor(body: any) {
    if (!body.examSessionId)
      throw new Error('examSessionId is required');
    if (!Array.isArray(body.answers) || body.answers.length === 0)
      throw new Error('answers must be a non-empty array');

    body.answers.forEach((a: any, i: number) => {
      if (!a.questionId)
        throw new Error(`answers[${i}].questionId is required`);
      if (typeof a.studentAnswer !== 'string' || !a.studentAnswer.trim())
        throw new Error(`answers[${i}].studentAnswer is required and must be a string`);
    });

    this.examSessionId = String(body.examSessionId); // ← THIS WAS MISSING
    this.answers = body.answers.map((a: any) => ({
      questionId:    String(a.questionId),
      studentAnswer: String(a.studentAnswer).trim()
    }));
  }
}