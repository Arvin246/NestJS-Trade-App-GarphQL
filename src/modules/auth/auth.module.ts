import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('JWT_EXPIRES_IN') ?? '7d';
        // JWT accepts number (seconds) or ms string like '7d'
        const expiresInSeconds =
          typeof expiresIn === 'string' && expiresIn.endsWith('d')
            ? parseInt(expiresIn, 10) * 24 * 60 * 60
            : 7 * 24 * 60 * 60;
        return {
          secret: config.get<string>('JWT_SECRET') ?? 'fallback-secret',
          signOptions: { expiresIn: expiresInSeconds },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, GqlAuthGuard],
  exports: [AuthService, GqlAuthGuard],
})
export class AuthModule {}
