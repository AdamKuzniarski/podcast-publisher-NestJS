import * as bcrypt from 'bcrypt';
import { seedAdmins } from './seed-admins';

describe('seedAdmins', () => {
  let mockPrisma: {
    adminUser: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(() => {
    mockPrisma = {
      adminUser: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
  });

  it('creates admin when none exists', async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue(null);
    mockPrisma.adminUser.create.mockResolvedValue({});

    await seedAdmins(mockPrisma, [{ email: 'a@test.com', password: 'secret' }]);

    expect(mockPrisma.adminUser.create).toHaveBeenCalledTimes(1);
  });

  it('does not overwrite an existing admin', async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue({ email: 'a@test.com' });

    await seedAdmins(mockPrisma, [{ email: 'a@test.com', password: 'secret' }]);

    expect(mockPrisma.adminUser.create).not.toHaveBeenCalled();
  });

  it('stores password as bcrypt hash, not plaintext', async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue(null);
    mockPrisma.adminUser.create.mockResolvedValue({});

    await seedAdmins(mockPrisma, [{ email: 'a@test.com', password: 'secret' }]);

    const { passwordHash } = mockPrisma.adminUser.create.mock.calls[0][0].data;
    expect(passwordHash).not.toBe('secret');
    expect(await bcrypt.compare('secret', passwordHash)).toBe(true);
  });
});
