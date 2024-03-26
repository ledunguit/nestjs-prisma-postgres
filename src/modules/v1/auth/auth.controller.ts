import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../base/base.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from '@/modules/v1/auth/dto/register.dto';
import { LogoutResponseType, TokensResponseType, VerifyResponseType } from '@/types/auth/response.type';
import { VerifyDto } from '@/modules/v1/auth/dto/verify.dto';
import { AuthDto } from '@/modules/v1/auth/dto/auth.dto';
import { AccessTokenGuard } from '@/auth/access-token.guard';
import { User } from '@prisma/client';
import { RefreshTokenGuard } from '@/auth/refresh-token.guard';
import { Request as ExpressRequest } from 'express';
import { NullableType } from '@/types/nullable.type';
import { GuardPayloadType } from '@/types/auth/guard-payload.type';

@ApiTags('Authentication V1')
@Controller({
  path: '/auth',
  version: '1',
})
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @ApiOperation({ summary: 'Register new account' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Verify email address' })
  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyDto: VerifyDto): Promise<VerifyResponseType> {
    return await this.authService.verifyEmail(verifyDto);
  }

  @ApiOperation({ summary: 'Log into application' })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto, @Ip() ip: string): Promise<TokensResponseType> {
    return await this.authService.login(authDto, ip);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out from application' })
  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: ExpressRequest & { user: User }): Promise<LogoutResponseType> {
    return await this.authService.logout(req);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get new accessToken using refreshToken' })
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() request: ExpressRequest & GuardPayloadType): Promise<TokensResponseType> {
    return await this.authService.refreshToken(request);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile information' })
  @Get('/profile')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  public profile(@Request() request: ExpressRequest & GuardPayloadType): Promise<NullableType<User>> {
    return this.authService.profile(request);
  }
}
