import { validate } from './env.validation';

describe('validate()', () => {
  it('accepts valid config', () => {
    expect(() =>
      validate({
        NODE_ENV: 'development',
        PORT: '3000',
        APP_CORS_ALLOWED_ORIGINS: 'http://localhost:3000',
      }),
    ).not.toThrow();
  });

  it('rejects missing APP_CORS_ALLOWED_ORIGINS', () => {
    expect(() => validate({ NODE_ENV: 'development', PORT: '3000' })).toThrow();
  });

  it('applies PORT default when omitted', () => {
    const env = validate({ APP_CORS_ALLOWED_ORIGINS: 'http://localhost:3000' });
    expect(env.PORT).toBe(4000);
  });

  it('applies NODE_ENV default when omitted', () => {
    const env = validate({ APP_CORS_ALLOWED_ORIGINS: 'http://localhost:3000' });
    expect(env.NODE_ENV).toBe('development');
  });

  it('rejects invalid NODE_ENV', () => {
    expect(() =>
      validate({
        NODE_ENV: 'staging',
        APP_CORS_ALLOWED_ORIGINS: 'http://localhost:3000',
      }),
    ).toThrow();
  });
});
