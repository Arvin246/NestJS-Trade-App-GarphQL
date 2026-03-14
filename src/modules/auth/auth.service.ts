import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    input: RegisterInput,
  ): Promise<{ user: User; access_token: string }> {
    const existing = await this.userService.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    const hashed = await bcrypt.hash(input.password, 10);
    const user = await this.userService.create({
      email: input.email,
      password: hashed,
      role: input.role,
    });
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return { user, access_token };
  }

  async login(
    input: LoginInput,
  ): Promise<{ user: User; access_token: string }> {
    const userWithPassword = await this.userService.findByEmail(input.email);
    if (!userWithPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const valid = await bcrypt.compare(
      input.password,
      userWithPassword.password,
    );
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const user: User = {
      id: userWithPassword.id,
      email: userWithPassword.email,
      role: userWithPassword.role,
    };
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return { user, access_token };
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.userService.findOne(userId);
  }
}
