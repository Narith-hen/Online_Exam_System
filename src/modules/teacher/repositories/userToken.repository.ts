import { AppDataSource } from '../../../config/database.config';
import { User } from '../entities/user.entity';
 
export class UserRepository {
  private repo = AppDataSource.getRepository(User);
 
  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
 
  findById(userId: string) {
    return this.repo.findOne({ where: { userId } });
  }
 
  findAllTeachers() {
    return this.repo.find({
      where: { roleId: process.env.TEACHER_ROLE_ID },
      select: ['userId', 'username', 'email', 'isActive', 'createAt'],
    });
  }
 
  async createTeacher(data: {
    username: string;
    email: string;
    passwordHash: string;
    roleId: string;
  }) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }
}