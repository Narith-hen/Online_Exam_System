import { AppDataSource } from "../../../config/database.config";
import { Result } from "../entities/result.entity";
import { User } from "../entities/user.entity";
import { randomUUID } from "crypto";

export class UserRepository {
  private repository = AppDataSource.getRepository(User);
  private resultRepository = AppDataSource.getRepository(Result);

  // login
  async findByEmail(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .select([
        "user.userId",
        "user.username",
        "user.email",
        "user.passwordHash",
        "user.roleId",
      ])
      .getOne();
  }

  // Register
  async createTeacher(data: {
    username: string;
    email: string;
    passwordHash: string;
    roleId: string;
  }): Promise<User> {
    const user = this.repository.create({
      userId: randomUUID(),
      ...data,
    });
    return this.repository.save(user);
  }

  // Show Results Student
  async getAllStudentResults() {
    return this.resultRepository
      .createQueryBuilder("result")
      .leftJoin("students", "student", "student.id = result.studentId")
      .select([
        "result.resultId AS resultId",
        "result.examSessionId AS examSessionId",
        "result.studentId AS studentId",
        "student.fullname AS studentName",
        "result.percentAge AS percentAge",
        "result.totalScore AS totalScore",
        "result.isPassed AS isPassed",
        "result.grade AS grade",
        "result.createAt AS createAt",
      ])
      .orderBy("result.createAt", "DESC")
      .getRawMany();
  }

    // Find all teachers
    async findAllTeachers(): Promise<User[]> {
      const roleId = process.env.TEACHER_ROLE_ID;
      if (!roleId) return [];

      return this.repository
        .createQueryBuilder('user')
        .where('user.roleId = :roleId', { roleId })
        .select([
          'user.userId',
          'user.username',
          'user.email',
          'user.roleId',
          'user.isActive',
          'user.createAt',
        ])
        .orderBy('user.createAt', 'DESC')
        .getMany();
    }
}
