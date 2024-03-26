import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Utils from '@/utils/utils';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractBearerTokenFromHeader(request);

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('auth.jwtRefreshSecret'),
      });

      request.guardPayload = {
        email: payload.email,
        refreshToken: token,
      };

      return true;
    } catch (error) {
      Utils.throwError(HttpStatus.FORBIDDEN, {
        message: Utils.t('auth.guard.invalid-token'),
      });
    }
  }

  private extractBearerTokenFromHeader(request: Request): string | undefined {
    const [type, refreshToken] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? refreshToken : undefined;
  }
}
