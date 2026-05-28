// dto/start-quiz.dto.ts
export class StartQuizDto {
  studentId: number;

  constructor(body: any) {
    if (!body.studentId) throw new Error('studentId is required');
    this.studentId = Number(body.studentId);
  }
}