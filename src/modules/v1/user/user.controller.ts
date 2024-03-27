import { Controller, Get, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '@/auth/access-token.guard';
import { Request as ExpressRequest } from 'express';
import { GuardPayloadType } from '@/types/auth/guard-payload.type';
import { ResponseProfileDto } from '@/modules/v1/user/dto/response-profile.dto';

@ApiTags('User V1')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile information' })
  @Get('/profile')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  public profile(@Request() request: ExpressRequest & GuardPayloadType): Promise<ResponseProfileDto> {
    return this.userService.profile(request);
  }
}
