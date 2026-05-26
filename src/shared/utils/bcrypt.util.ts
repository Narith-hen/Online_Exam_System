import crypto from 'node:crypto';

const DEFAULT_ITERATIONS = 100_000;
const KEYLEN = 64;
const DIGEST = 'sha512';

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, DEFAULT_ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return `pbkdf2$${DEFAULT_ITERATIONS}$${salt}$${hash}`;
}

export async function comparePassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;

  const iterations = Number(parts[1]);
  const salt = parts[2];
  const expected = parts[3];

  const hash = crypto.pbkdf2Sync(password, salt, iterations, KEYLEN, DIGEST).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expected, 'hex'));
}

