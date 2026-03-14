import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany({
      select: { id: true, email: true, role: true },
    });
    return rows as User[];
  }

  async findOne(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });
    return row as User | null;
  }

  async findByEmail(email: string): Promise<{
    id: string;
    email: string;
    role: string;
    password: string;
  } | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    password: string;
    role?: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role ?? 'USER',
      },
      select: { id: true, email: true, role: true },
    });
    return user as User;
  }
}
