import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from '@/mail/mail.module';
import { UserModule } from '@/modules/v1/user/user.module';
import { AccessTokenJwtStrategy } from '@/modules/v1/auth/strategies/access-token-jwt.strategy';
import { RefreshTokenJwtStrategy } from '@/modules/v1/auth/strategies/refresh-token-jwt.strategy';

@Module({
  imports: [
    UserModule,
    MailModule,
    // This Jwt module is used to sign the access and refresh tokens
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          logger: true,
          secret: configService.get('auth.jwtSecret'),
          signOptions: {
            expiresIn: configService.get('auth.jwtExpiresIn'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // These strategies are used to validate the access token
    AccessTokenJwtStrategy,
    RefreshTokenJwtStrategy,
  ],
})
export class AuthModule {}
