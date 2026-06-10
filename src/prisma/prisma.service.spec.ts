import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  it('can be instantiated', () => {
    jest.spyOn(PrismaService.prototype, '$connect').mockResolvedValue();
    const service = new PrismaService();
    expect(service).toBeDefined();
    jest.restoreAllMocks();
  });
});
