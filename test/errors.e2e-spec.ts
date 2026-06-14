import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './utils/create-test-app';
import { resetTestDatabase } from './utils/reset-test-database';
import { ErrorCode } from '../src/common/errors/error-code';
import { TEST_ADMIN_PASSWORD } from './utils/test-constants';

describe('Error responses (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await resetTestDatabase();
    await app.close();
  });

  describe('Validation errors', () => {
    it('POST /auth/login with empty body returns consistent format', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.VALIDATION_ERROR);
          expect(res.body.message).toBe('Request validation failed.');
          expect(res.body.fieldErrors).toBeDefined();
          expect(typeof res.body.fieldErrors).toBe('object');
        });
    });

    it('POST /auth/login with invalid email returns fieldErrors keyed by field', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'not-an-email', password: TEST_ADMIN_PASSWORD })
        .expect(400)
        .expect((res) => {
          expect(res.body.code).toBe(ErrorCode.VALIDATION_ERROR);
          expect(res.body.fieldErrors).toHaveProperty('email');
        });
    });
  });

  describe('Unauthorized errors', () => {
    it('GET /auth/me without token returns consistent format', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .expect(401)
        .expect((res) => {
          expect(res.body.status).toBe(401);
          expect(res.body.code).toBe(ErrorCode.UNAUTHORIZED);
          expect(typeof res.body.message).toBe('string');
        });
    });

    it('GET /auth/me with malformed token returns consistent format', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer not.a.valid.jwt')
        .expect(401)
        .expect((res) => {
          expect(res.body.status).toBe(401);
          expect(res.body.code).toBe(ErrorCode.UNAUTHORIZED);
        });
    });
  });
});
