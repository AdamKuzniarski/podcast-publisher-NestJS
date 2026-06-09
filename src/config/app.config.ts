import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  corsOrigins: (process.env.APP_CORS_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim()),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}));
