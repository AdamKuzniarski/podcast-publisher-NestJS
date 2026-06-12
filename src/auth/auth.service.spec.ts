import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockPrisma: { adminUser: { findUnique: jest.Mock } };
  let mockJwt: { sign: jest.Mock };

  beforeEach(() => {
    mockPrisma = { adminUser: { findUnique: jest.fn() } };
    mockJwt = { sign: jest.fn().mockReturnValue('header.payload.signature') };
    service = new AuthService(
      mockPrisma as any,
      mockJwt as unknown as JwtService,
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('returns access_token for valid credentials', async () => {
    const hash = await bcrypt.hash('secret', 10);
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      id: 'uuid-1',
      email: 'admin@test.com',
      passwordHash: hash,
    });

    const result = await service.login({
      email: 'admin@test.com',
      password: 'secret',
    });

    expect(result).toEqual({ access_token: 'header.payload.signature' });
    expect(mockJwt.sign).toHaveBeenCalledWith({
      sub: 'uuid-1',
      email: 'admin@test.com',
    });
  });

  it('throws UnauthorizedException for unknown email', async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'nobody@test.com', password: 'secret' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException for wrong password', async () => {
    const hash = await bcrypt.hash('correct', 10);
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      id: 'uuid-1',
      email: 'admin@test.com',
      passwordHash: hash,
    });

    await expect(
      service.login({ email: 'admin@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('returned token is a well-formed JWT (3 dot-separated segments)', async () => {
    const hash = await bcrypt.hash('secret', 10);
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      id: 'uuid-1',
      email: 'admin@test.com',
      passwordHash: hash,
    });

    const result = await service.login({
      email: 'admin@test.com',
      password: 'secret',
    });

    expect(result.access_token.split('.').length).toBe(3);
  });
});
