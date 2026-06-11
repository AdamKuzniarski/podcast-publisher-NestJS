import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { seedAdmins } from '../src/seed/seed-admins';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admins = [
    {
      email: process.env.ADMIN_1_EMAIL ?? '',
      password: process.env.ADMIN_1_PASSWORD ?? '',
    },
    {
      email: process.env.ADMIN_2_EMAIL ?? '',
      password: process.env.ADMIN_2_PASSWORD ?? '',
    },
  ];

  for (const { email, password } of admins) {
    if (!email || !password) {
      throw new Error(
        'ADMIN_1_EMAIL, ADMIN_1_PASSWORD, ADMIN_2_EMAIL, ADMIN_2_PASSWORD must all be set',
      );
    }
  }

  await seedAdmins(prisma, admins);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
