import bcrypt from "bcryptjs";
import { RegisterDto } from "../dto/register.dto";
import { UserRepository } from "../repositories/user.repository";

export class RegisterService {
    private userRepository = new UserRepository();
    private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    async teacherRegister(createDto: RegisterDto) {
        const { username, password } = createDto;
        const email = createDto.email?.trim().toLowerCase();

        // check email
        if (!this.emailRegex.test(email)) {
            throw new Error("Please enter a valid email address.");
        }

        // Removed Gmail restriction - now any email is allowed
        const user = await this.userRepository.findByEmail(email);

        // Already register
        if (user) {
            throw new Error("Email is already registered.");
        }

        // ==================== PASSWORD SECURITY CHECKS ====================
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
        }

        if (password.length > 128) {
            throw new Error("Password is too long (maximum 128 characters).");
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            throw new Error(
                "Password must contain at least one uppercase letter, one lowercase letter, and one number."
            );
        }

        if (!process.env.TEACHER_ROLE_ID) {
            throw new Error("Teacher role is not configured.");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const createdUser = await this.userRepository.createTeacher({
            username,
            email,
            passwordHash,
            roleId: process.env.TEACHER_ROLE_ID,
        });

        const { passwordHash: _, ...userWithoutPassword } = createdUser;

        return {
            message: "Teacher registered successfully",
            user: userWithoutPassword,
        };
    }
}