import { AppDataSource } from "../../../config/database.config";
import { User } from "../entities/user.entity";

export class UserRepository {
    private repository = AppDataSource.getRepository(User);

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({
            where: { email },
        });
    }
}