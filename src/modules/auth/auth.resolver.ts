import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthPayload } from './dto/auth.payload';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }
}
