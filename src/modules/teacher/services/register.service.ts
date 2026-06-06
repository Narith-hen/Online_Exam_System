import bcrypt from 'bcryptjs';
import { RegisterDto } from '../dto/register.dto';
import { UserRepository } from '../repositories/user.repository';
import { TeacherTokenService } from './teacherToken.service';  // ← add this

export class RegisterService {
  private userRepository  = new UserRepository();
  private tokenService    = new TeacherTokenService();          // ← add this
  private emailRegex      = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  async teacherRegister(createDto: RegisterDto) {
    const { username, password } = createDto;
    const email = createDto.email?.trim().toLowerCase();

    if (!username?.trim()) {
      throw new Error('Username is required.');
    }

    if (!this.emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email is already registered.');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    if (password.length > 128) {
      throw new Error('Password is too long (maximum 128 characters).');
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers   = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      throw new Error(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      );
    }

    if (!process.env.TEACHER_ROLE_ID) {
      throw new Error('Teacher role is not configured. Contact admin.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const createdUser = await this.userRepository.createTeacher({
      username: username.trim(),
      email,
      passwordHash,
      roleId: process.env.TEACHER_ROLE_ID,
    });

    // ── Generate & save token to DB ──────────────────────────────
    const token = await this.tokenService.saveToken(
      createdUser.userId,   // ← use createdUser (not user)
      createdUser.email,
      createdUser.roleId,
    );

    const { passwordHash: _, ...userWithoutPassword } = createdUser;

    return {
      message: 'Teacher registered successfully.',
      token,                                        // ← token from DB
      user: userWithoutPassword,
    };
  }
}