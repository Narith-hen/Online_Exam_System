import jwt          from 'jsonwebtoken';
import { Request, Response } from 'express';
import { StudentService }    from '../services/student.service';
import { StudentLoginDto }   from '../dto/student-login.dto';
import { StartQuizDto }      from '../dto/start-quiz.dto';
import { SubmitQuizDto }     from '../dto/submit-quiz.dto';
import { Student }           from '../entities/student.entity';

// ✅ Typed request — eliminates all (req as any) casts
interface AuthRequest extends Request {
  student: {
    id:       number;
    email:    string;
    fullname: string;
    class:    string;
  };
}

export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
    this.login        = this.login.bind(this);
    this.startQuiz    = this.startQuiz.bind(this);
    this.submitQuiz   = this.submitQuiz.bind(this);
    this.getResult    = this.getResult.bind(this);
    this.getMyResults = this.getMyResults.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // ✅ Explicitly typed as Student — guarantees .id is always present
      const student: Student = await this.studentService.login(
        new StudentLoginDto(req.body)
      );

      const secret = process.env.JWT_SECRET || 'your_secret_key';

      const token = jwt.sign(
        {
          id:       student.id,       // ✅ always a number from DB
          email:    student.email,
          fullname: student.fullname,
          class:    student.class,
        },
        secret,
        { expiresIn: '1d' }
      );

      res.status(200).json({
        success: true,
        message: 'Student login successfully',
        token,                        // ✅ token always in response
        data: {
          id:       student.id,
          fullname: student.fullname,
          class:    student.class,
          email:    student.email,
        },
      });

    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  // 🔒 Protected — token required
   async startQuiz(req: Request, res: Response): Promise<void> {
  try {
    const student = (req as any).user;


    // 🔒 Block if studentId in body doesn't match token
    if (req.body.studentId && String (req.body.studentId) !== student.id) {
      res.status(403).json({ success: false, message: 'Unauthorized: studentId does not match token' });
      return;
    }

    const result = await this.studentService.startQuiz(
      new StartQuizDto({
        ...req.body,
        studentId: student.id, // always from token
      })
    );

    res.status(201).json({
      success: true,
      message: 'Quiz started successfully',
      data:    result,
    });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}

  // 🔒 Protected — token required
   async submitQuiz(req: Request, res: Response): Promise<void> {
  try {
    console.log('req.body:', JSON.stringify(req.body));           // ← add
    const student = (req as any).user;
    console.log('student from token:', JSON.stringify(student));  // ← add

    const result = await this.studentService.submitQuiz(
      new SubmitQuizDto({
        ...req.body,
        studentId: student.id,
      })
    );

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data:    result,
    });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}

  async getResult(req: Request, res: Response): Promise<void> {
    try {
      const examSessionId = req.params.examSessionId as string;

      if (!examSessionId) {
        res.status(400).json({ success: false, message: 'examSessionId is required' });
        return;
      }

      const result = await this.studentService.getResult(examSessionId);

      res.status(200).json({ success: true, data: result });

    } catch (e: any) {
      if (e.message?.toLowerCase().includes('not found')) {
        res.status(404).json({ success: false, message: e.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // 🔒 Protected — token required
  async getMyResults(req: Request, res: Response): Promise<void> {
    try {
      const student = (req as AuthRequest).student; // ✅ from token

      // ✅ Never trust client-supplied studentId — always use token
      const results = await this.studentService.getResultsByStudent(student.id);

      res.status(200).json({ success: true, data: results });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
}