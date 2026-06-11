import { Pool } from 'pg';

export async function resetTestDatabase(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query(
    'TRUNCATE "AuditEvent", "Episode", "Podcast", "AdminUser" RESTART IDENTITY CASCADE',
  );
  await pool.end();
}
