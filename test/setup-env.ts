import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.test') });

process.env.NODE_ENV = 'test';
process.env.PORT = '4000';
process.env.APP_CORS_ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5433/podcast_db_test';
process.env.JWT_SECRET = 'test-secret-at-least-16-chars-long';
process.env.JWT_EXPIRATION = '7d';
