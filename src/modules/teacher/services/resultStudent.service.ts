import { Result } from "../entities/result.entity";
import { UserRepository } from "../repositories/user.repository";

export class ResultStudentService {
  private userRepository = new UserRepository();

  async getAllStudentResults(): Promise<Result[]> {
    return this.userRepository.getAllStudentResults();
  }
}

