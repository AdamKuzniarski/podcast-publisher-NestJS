import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });

    if (!admin) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const token = this.jwtService.sign({ sub: admin.id, email: admin.email });
    return { access_token: token };
  }
}
