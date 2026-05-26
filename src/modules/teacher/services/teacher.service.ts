import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { LoginDto } from "../dto/login.dto";
import { UserRepository } from "../repositories/user.repository";

export class AuthService {
  private userRepository = new UserRepository();

  async teacherLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email");
    }

    console.log("User RoleId:", user.roleId);

    if (user.roleId !== process.env.TEACHER_ROLE_ID) {
      throw new Error(
        `Only teachers can login here. Your roleId is: ${user.roleId}`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const jwtSecret = process.env.JWT_SECRET || "secret";
    const jwtOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "1d") as SignOptions["expiresIn"],
    };

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
}
