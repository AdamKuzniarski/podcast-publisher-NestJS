import { Pool } from 'pg';
import { resetTestDatabase } from './utils/reset-test-database';

describe('resetTestDatabase', () => {
  let pool: Pool;

  beforeAll(() => {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('truncates all tables so no data leaks between tests', async () => {
    await pool.query(
      `INSERT INTO "AdminUser" (id, email, "passwordHash", "createdAt")
       VALUES (gen_random_uuid(), 'seed@test.com', 'hash', NOW())`,
    );

    const before = await pool.query('SELECT COUNT(*) FROM "AdminUser"');
    expect(Number(before.rows[0].count)).toBeGreaterThan(0);

    await resetTestDatabase();

    const after = await pool.query('SELECT COUNT(*) FROM "AdminUser"');
    expect(Number(after.rows[0].count)).toBe(0);
  });
});
