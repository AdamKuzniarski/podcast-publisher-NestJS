import { validate } from './env.validation';

const BASE = {
  APP_CORS_ALLOWED_ORIGINS: 'http://localhost:3000',
  DATABASE_URL: 'postgresql://postgres:change-me@localhost:5432/podcast_db',
  JWT_SECRET: 'test-secret-at-least-16-chars-long',
};

describe('validate()', () => {
  it('accepts valid config', () => {
    expect(() =>
      validate({ ...BASE, NODE_ENV: 'development', PORT: '3000' }),
    ).not.toThrow();
  });

  it('rejects missing APP_CORS_ALLOWED_ORIGINS', () => {
    expect(() =>
      validate({
        DATABASE_URL: BASE.DATABASE_URL,
        NODE_ENV: 'development',
        PORT: '3000',
      }),
    ).toThrow();
  });

  it('rejects missing DATABASE_URL', () => {
    expect(() =>
      validate({ APP_CORS_ALLOWED_ORIGINS: BASE.APP_CORS_ALLOWED_ORIGINS }),
    ).toThrow();
  });

  it('applies PORT default when omitted', () => {
    const env = validate(BASE);
    expect(env.PORT).toBe(4000);
  });

  it('applies NODE_ENV default when omitted', () => {
    const env = validate(BASE);
    expect(env.NODE_ENV).toBe('development');
  });

  it('rejects invalid NODE_ENV', () => {
    expect(() => validate({ ...BASE, NODE_ENV: 'staging' })).toThrow();
  });

  it.each([0, -1, 65536, 70000, 3.14])('rejects invalid port %s', (port) => {
    expect(() => validate({ ...BASE, PORT: String(port) })).toThrow();
  });

  it.each(['7d', '1h', '30m', '3600s', '2w', '1year'])(
    'accepts valid JWT_EXPIRATION "%s"',
    (exp) => {
      expect(() => validate({ ...BASE, JWT_EXPIRATION: exp })).not.toThrow();
    },
  );

  it.each(['', 'foo', 'abc', '7days-invalid', '0x1f'])(
    'rejects invalid JWT_EXPIRATION "%s"',
    (exp) => {
      expect(() => validate({ ...BASE, JWT_EXPIRATION: exp })).toThrow();
    },
  );
});
