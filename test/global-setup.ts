import { execSync } from 'child_process';

export default async function globalSetup() {
  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5433/podcast_db_test';

  execSync('npx prisma migrate deploy', {
    env: { ...process.env },
    stdio: 'inherit',
  });
}
