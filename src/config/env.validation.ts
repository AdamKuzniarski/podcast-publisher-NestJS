import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(4000),
  APP_CORS_ALLOWED_ORIGINS: z.string().min(1),
});

export type Env = z.infer<typeof EnvSchema>;

export function validate(config: Record<string, unknown>): Env {
  const result = EnvSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`ENV validation failed:\n${result.error.toString()}`);
  }
  return result.data;
}
