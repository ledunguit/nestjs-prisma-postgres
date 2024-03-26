import { HttpStatus, Injectable, Request } from '@nestjs/common';
import { BaseService } from '@/modules/base/base.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/mail/mail.service';
import * as crypto from 'crypto';
import { RegisterDto } from '@/modules/v1/auth/dto/register.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { UserService } from '@/modules/v1/user/user.service';
import { TokensPairType } from '@/types/auth/get-tokens.type';
import { AuthProvider, User } from '@prisma/client';
import { LogoutResponseType, TokensResponseType, VerifyResponseType } from '@/types/auth/response.type';
import { VerifyDto } from '@/modules/v1/auth/dto/verify.dto';
import { AuthDto } from '@/modules/v1/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Request as ExpressRequest } from 'express';
import { NullableType } from '@/types/nullable.type';
import { GuardPayloadType } from '@/types/auth/guard-payload.type';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async getTokens(email: string): Promise<TokensPairType> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { email },
        {
          secret: this.configService.get('auth.jwtSecret', { infer: true }),
          expiresIn: this.configService.get('auth.jwtExpiresIn', {
            infer: true,
          }),
        },
      ),
      this.jwtService.signAsync(
        { email },
        {
          secret: this.configService.get('auth.jwtRefreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.get('auth.jwtRefreshExpiresIn', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<void> {
    const userEmailExists = await this.prismaClient.user.findFirst({
      where: { email: registerDto.email },
    });

    if (userEmailExists) {
      this.throwError(HttpStatus.CONFLICT, {
        message: this.t('auth.register.email.exists', { value: registerDto.email }),
      });
    }

    const emailVerificationToken = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');
    await this.userService.create(registerDto, emailVerificationToken);

    await this.mailService.sendRegisterConfirmationEmail({
      to: registerDto.email,
      data: {
        email: registerDto.email,
        emailVerificationToken,
      },
    });
  }

  async verifyEmail({ email_verification_token, email }: VerifyDto): Promise<VerifyResponseType> {
    const user: User = await this.prismaClient.user.findFirst({
      where: { email, emailVerificationToken: email_verification_token },
    });

    if (!user) {
      this.throwError(HttpStatus.NOT_FOUND, {
        message: this.t('auth.verify-email.not-found', { value: email }),
      });
    }

    await this.prismaClient.user.update({
      where: { email },
      data: {
        emailVerificationToken: null,
        emailVerifiedAt: new Date(),
      },
    });

    return {
      success: true,
      message: this.t('auth.verify-email.success'),
    };
  }

  async login(authDto: AuthDto, ip: string): Promise<TokensResponseType> {
    const user: User = await this.prismaClient.user.findFirst({
      where: { email: authDto.email },
    });

    const isValidPassword = await bcrypt.compare(authDto.password, user.password);

    if (!user || !isValidPassword) {
      this.throwError(HttpStatus.UNPROCESSABLE_ENTITY, {
        message: this.t('auth.login.incorrect'),
      });
    }

    if (user.provider !== AuthProvider.EMAIL) {
      this.throwError(HttpStatus.UNPROCESSABLE_ENTITY, {
        message: this.t('auth.login.wrong-provider', {
          provider: user.provider.toLowerCase().charAt(0).toUpperCase() + user.provider.toLowerCase().slice(1),
        }),
      });
    }

    if (!user.emailVerifiedAt) {
      this.throwError(HttpStatus.UNPROCESSABLE_ENTITY, {
        message: this.t('auth.login.unverified'),
      });
    }

    const tokens = await this.getTokens(user.email);

    const refreshTokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');

    await this.prismaClient.user.update({
      where: { email: user.email },
      data: {
        refreshToken: refreshTokenHash,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    return { tokens };
  }

  async logout(@Request() req: ExpressRequest & { user: User }): Promise<LogoutResponseType> {
    if (!req.user) {
      this.throwError(HttpStatus.UNAUTHORIZED, {
        message: this.t('auth.logout.unauthorized'),
      });
    }

    await this.prismaClient.user.update({
      where: { email: req.user.email },
      data: {
        refreshToken: null,
      },
    });

    return {
      success: true,
    };
  }

  async refreshToken(@Request() request: ExpressRequest & GuardPayloadType): Promise<TokensResponseType> {
    const { email, refreshToken } = request.guardPayload;

    const user = await this.prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !user.refreshToken) {
      this.throwError(HttpStatus.FORBIDDEN, {
        message: this.t('auth.refresh-token.invalid-token'),
      });
    }

    const checkMatchRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex') === user.refreshToken;

    if (!checkMatchRefreshToken) {
      this.throwError(HttpStatus.FORBIDDEN, {
        message: this.t('auth.refresh-token.invalid-token'),
      });
    }

    const tokens = await this.getTokens(email);

    const refreshTokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');

    await this.prismaClient.user.update({
      where: { email: email },
      data: {
        refreshToken: refreshTokenHash,
      },
    });

    return {
      tokens,
    };
  }

  async profile(@Request() request: ExpressRequest & GuardPayloadType): Promise<NullableType<User>> {
    return this.prismaClient.user.findFirst({
      where: { email: request.guardPayload.email },
    });
  }
}
