import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  APP_CORS_ALLOWED_ORIGINS: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRATION: z
    .string()
    .regex(
      /^\d+(\.\d+)?\s*(ms|s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|week|weeks|y|yr|yrs|year|years)$/i,
      'JWT_EXPIRATION must be a valid duration (e.g. "7d", "1h", "30m")',
    )
    .default('7d'),
});

export type Env = z.infer<typeof EnvSchema>;

export function validate(config: Record<string, unknown>): Env {
  const result = EnvSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`ENV validation failed:\n${result.error.toString()}`);
  }
  return result.data;
}
