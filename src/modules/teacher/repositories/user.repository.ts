import { AppDataSource } from "../../../config/database.config";
import { User } from "../entities/user.entity";
import { randomUUID } from "crypto";

export class UserRepository {
  private repository = AppDataSource.getRepository(User);

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
}
