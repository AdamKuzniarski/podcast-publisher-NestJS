import * as bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './utils/create-test-app';
import { resetTestDatabase } from './utils/reset-test-database';
import { PrismaService } from '../src/prisma/prisma.service';

const TEST_EMAIL = 'admin@test.com';
const TEST_PASSWORD = 'TestPassword123!';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
    const prisma = app.get(PrismaService);
    const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
    await prisma.adminUser.create({
      data: { email: TEST_EMAIL, passwordHash },
    });
  });

  afterAll(async () => {
    await resetTestDatabase();
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('returns 200 and a JWT access_token for valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD })
        .expect(200)
        .expect((res) => {
          expect(typeof res.body.access_token).toBe('string');
          expect(res.body.access_token.split('.').length).toBe(3);
        });
    });

    it('returns 401 for wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: TEST_EMAIL, password: 'wrongpassword' })
        .expect(401);
    });

    it('returns 401 for unknown email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nobody@test.com', password: TEST_PASSWORD })
        .expect(401);
    });

    it('returns 400 for missing fields', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });
  });

  describe('GET /auth/me', () => {
    let token: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
      token = res.body.access_token as string;
    });

    it('returns 200 and the admin email for a valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(TEST_EMAIL);
        });
    });

    it('returns 401 with no token', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('returns 401 with a malformed token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer not.a.valid.jwt')
        .expect(401);
    });
  });
});
