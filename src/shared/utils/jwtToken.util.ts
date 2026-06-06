import jwt from 'jsonwebtoken';
 
const SECRET = process.env.JWT_SECRET ?? 'change_me_in_env';
 
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
 
export function generateToken(payload: JwtPayload, expiresInSeconds: number): string {
  return jwt.sign(payload, SECRET, { expiresIn: expiresInSeconds });
}
 
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}