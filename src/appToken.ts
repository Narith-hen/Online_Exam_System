export const TOKEN_CONFIG = {
  expiresInSeconds: parseInt(process.env.JWT_EXPIRES_IN_SECONDS ?? '86400', 10),
  headerPrefix    : 'Bearer ',
};