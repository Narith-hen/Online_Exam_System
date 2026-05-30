import crypto from 'node:crypto';

type Payload = Record<string, unknown>;

function base64url(input: Buffer | string): string {
  const raw = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return raw.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlJson(obj: unknown): string {
  return base64url(JSON.stringify(obj));
}

function sign(data: string, secret: string): string {
  return base64url(crypto.createHmac('sha256', secret).update(data).digest());
}

export function generateToken(payload: Payload, expiresInSeconds = 60 * 60): string {
  const secret = process.env.JWT_SECRET ?? 'dev_secret_change_me';
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };

  const part1 = base64urlJson(header);
  const part2 = base64urlJson(body);
  const signingInput = `${part1}.${part2}`;
  const signature = sign(signingInput, secret);
  return `${signingInput}.${signature}`;
}

export function verifyToken(token: string): Payload {
  const secret = process.env.JWT_SECRET ?? 'dev_secret_change_me';
  const [p1, p2, sig] = token.split('.');
  if (!p1 || !p2 || !sig) throw new Error('Invalid token format');

  const signingInput = `${p1}.${p2}`;
  const expected = sign(signingInput, secret);
  if (expected !== sig) throw new Error('Invalid token signature');

  const payload = JSON.parse(Buffer.from(p2.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < now) throw new Error('Token expired');
  return payload as Payload;
}

