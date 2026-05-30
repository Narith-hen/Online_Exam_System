// dto/start-quiz.dto.ts
export class StartQuizDto {
  studentId: number;
  examId:    string;

  constructor(body: any) {
    if (!body.studentId) throw new Error('studentId is required');
    if (!body.examId)    throw new Error('examId is required');
    this.studentId = Number(body.studentId);
    this.examId    = body.examId;
  }
}