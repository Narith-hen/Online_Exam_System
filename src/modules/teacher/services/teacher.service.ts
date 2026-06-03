import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginDto } from "../dto/login.dto";
import { UserRepository } from "../repositories/user.repository";

export class AuthService {
  private userRepository = new UserRepository();

  async teacherLogin(loginDto: LoginDto) {
    const { username, email, password } = loginDto;

    if (!username || !email || !password) {
      throw new Error("Username, email, and password are required.");
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email. Please check your email and try again.");
    }

    // check email 
    if (user.email !== email) {
      throw new Error("Invalid email. Please check your email and try again.");
    }

    // check username
    if (user.username !== username) {
      throw new Error("Invalid username. Please check your username and try again.");
    }

    // Check if user is a teacher
    if (user.roleId !== process.env.TEACHER_ROLE_ID) {
      throw new Error("This login portal is only for teachers.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);

    //check password
    if (!isPasswordValid) {
      throw new Error("Invalid password. Please check your password.");
    }

    const jwtSecret = process.env.JWT_SECRET || "secret";

    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
        role: user.roleId,
      },
      jwtSecret,
      {
        expiresIn: (process.env.JWT_EXPIRES_IN ||
          "1d") as jwt.SignOptions["expiresIn"],
      },
    );

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      message: "login successful",
      token,
      user: userWithoutPassword,
    };
  }

  async getAllTeachers() {
    const teachers = await this.userRepository.findAllTeachers();
    return {
      message: 'Teachers fetched successfully',
      data: teachers,
    };
  }
}
