import { Module } from '@nestjs/common';
import { AuthController } from '@/modules/v2/auth/auth.controller';
import { UserModule } from '@/modules/v1/user/user.module';
import { MailModule } from '@/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '@/modules/v1/auth/auth.service';

@Module({
  imports: [
    UserModule,
    MailModule,
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
  providers: [AuthService],
})
export class AuthModule {}
