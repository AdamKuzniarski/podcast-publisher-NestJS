import * as bcrypt from 'bcrypt';

type AdminUserDelegate = {
  findUnique: (args: {
    where: { email: string };
  }) => Promise<{ email: string } | null>;
  create: (args: {
    data: { email: string; passwordHash: string };
  }) => Promise<unknown>;
};

type PrismaLike = {
  adminUser: AdminUserDelegate;
};

export async function seedAdmins(
  prisma: PrismaLike,
  admins: Array<{ email: string; password: string }>,
): Promise<void> {
  for (const { email, password } of admins) {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.adminUser.create({ data: { email, passwordHash } });
    }
  }
}
