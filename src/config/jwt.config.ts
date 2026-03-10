import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret-change-me',
  expiration: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
}));
