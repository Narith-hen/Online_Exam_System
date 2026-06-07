import { AppDataSource } from '../../../data-source';
import { TeacherToken } from '../entities/teacherToken';
import { generateToken, verifyToken } from '../../../shared/utils/jwt.util';
import { TOKEN_CONFIG } from '../../../appToken';

export class TeacherTokenService {
  private repo = AppDataSource.getRepository(TeacherToken);

  // Called after register/login — saves token to DB
  async saveToken(teacherId: string, email: string, roleId: string): Promise<string> {
    // Deactivate all previous tokens
    await this.repo.update(
      { teacherId, isActive: true },
      { isActive: false },
    );

    const token = generateToken(
      { id: teacherId, email, role: roleId },
      TOKEN_CONFIG.expiresInSeconds,
    );

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + TOKEN_CONFIG.expiresInSeconds);

    const record = this.repo.create({ teacherId, token, isActive: true, expiresAt });
    await this.repo.save(record);

    return token;
  }

  // Verify token is valid JWT + active in DB
  async verifyTeacherToken(token: string) {
  const payload = verifyToken(token); // throws if expired or invalid

  const record = await this.repo.findOne({
    where    : { token, isActive: true },
    relations: { teacher: true },      // ← object format, not array
  });

  if (!record) throw new Error('Token has been revoked or does not exist.');

  if (new Date() > record.expiresAt) {
    await this.repo.update({ tokenId: record.tokenId }, { isActive: false });
    throw new Error('Token has expired. Please log in again.');
  }

  const { passwordHash: _, ...teacherWithoutPassword } = record.teacher as any;

  return {
    message  : 'Token is valid.',
    payload,
    teacher  : teacherWithoutPassword,
    expiresAt: record.expiresAt,
  };
}

  // Get all active tokens for a teacher
  async getMyTokens(teacherId: string) {
    const tokens = await this.repo.find({
      where: { teacherId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return { message: 'Active tokens fetched.', data: tokens };
  }

  // Revoke current token (logout)
  async revokeToken(token: string) {
    const record = await this.repo.findOne({ where: { token, isActive: true } });
    if (!record) throw new Error('Token not found or already revoked.');

    await this.repo.update({ tokenId: record.tokenId }, { isActive: false });
    return { message: 'Logged out successfully. Token revoked.' };
  }

  // Revoke all tokens (logout all devices)
  async revokeAllTokens(teacherId: string) {
    await this.repo.update(
      { teacherId, isActive: true },
      { isActive: false },
    );
    return { message: 'All tokens revoked. Logged out from all devices.' };
  }
}