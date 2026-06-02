import { Request, Response } from 'express';

// ── EXAM ──────────────────────────────────────

export const getAllExams = async (req: Request, res: Response): Promise<void> => {
  try {
    const exams = [
      {
        id: 1,
        examTitle: 'Sample Exam',
        examCode: 'EXAM2026',
        createdAt: new Date().toISOString(),
      },
    ];
    res.status(200).json({
      "success": true,
      message: 'Exams fetched successfully',
      data: exams,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};


export const getExamById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    res.status(200).json({
      message: 'Exam fetched successfully',
      data: {
        id: Number(examId),
        examId: Number(examId),
        startTime: '2024-01-15T08:00:00',
        endTime: '2024-01-15T10:00:00',
        duration: 120,
        createdAt: '2024-01-15T08:00:00.000Z',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const createExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    res.status(201).json({
      message: 'Exam session created successfully',
      data: {
        id: 1,
        examId: body.examId,
        startTime: body.startTime,
        endTime: body.endTime,
        duration: body.duration,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    const body = req.body;
    res.status(200).json({
      message: 'Exam session updated successfully',
      data: {
        id: Number(examId),
        examId: Number(examId),
        startTime: body.startTime,
        endTime: body.endTime,
        duration: body.duration,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteExam = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: 'Exam session deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── QUESTION ──────────────────────────────────

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    const body = req.body;
    res.status(201).json({
      message: 'Question created successfully',
      data: {
        id: 1,
        examId: Number(examId),
        text: body.text,
        type: body.type,
        points: body.points,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId, questionId } = req.params;
    const body = req.body;
    res.status(200).json({
      message: 'Question updated successfully',
      data: {
        id: Number(questionId),
        examId: Number(examId),
        text: body.text,
        type: body.type,
        points: body.points,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: 'Question deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── ANSWER ────────────────────────────────────

export const createAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionId } = req.params;
    const body = req.body;
    res.status(201).json({
      message: 'Answer created successfully',
      data: {
        id: 1,
        questionId: Number(questionId),
        text: body.text,
        isCorrect: body.isCorrect,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionId, answerId } = req.params;
    const body = req.body;
    res.status(200).json({
      message: 'Answer updated successfully',
      data: {
        id: Number(answerId),
        questionId: Number(questionId),
        text: body.text,
        isCorrect: body.isCorrect,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: 'Answer deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── RESULT ────────────────────────────────────

export const getExamResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    res.status(200).json({
      message: 'Student results fetched successfully',
      data: [
        {
          resultId: 'c1f6f6d5-5a64-11f1-8d76-50ebf649a0bc',
          examSessionId: '06a64c2e-5a62-11f1-8d76-50ebf649a0bc',
          examId: Number(examId),
          studentId: 1,
          studentName: 'Visa San',
          percentAge: '85.00',
          totalScore: '85.00',
          isPassed: 1,
          grade: 'A',
          createAt: '2026-05-28T07:13:42.000Z',
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getStudentResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId, studentId } = req.params;
    res.status(200).json({
      message: 'Student results fetched successfully',
      data: [
        {
          resultId: 'c1f6f6d5-5a64-11f1-8d76-50ebf649a0bc',
          examSessionId: '06a64c2e-5a62-11f1-8d76-50ebf649a0bc',
          examId: Number(examId),
          studentId: Number(studentId),
          studentName: 'Visa San',
          percentAge: '85.00',
          totalScore: '85.00',
          isPassed: 1,
          grade: 'A',
          createAt: '2026-05-28T07:13:42.000Z',
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};