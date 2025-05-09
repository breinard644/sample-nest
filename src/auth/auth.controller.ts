import { Body, Controller, ForbiddenException, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { dot } from 'node:test/reporters';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';           // ← import from express

import { getUser } from './decorator/get-user.decorator';
// import { GetRefreshToken, GetUser, RtGuard } from './guard/rt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin/:email/:password/:name')
  @ApiParam({ name: 'email', example: 'abc@example.com' })
  @ApiParam({ name: 'password', example: '123456' })
  @ApiParam({ name: 'name', example: 'binu' })
  async signin(
    @Param('email') email: string,
    @Param('password') password: string,
    @Param('name') name: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signin(email, password, name);

    // Set refresh token in secure HTTP-only cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Number(process.env.JWT_EXPIRE) * 1000, // convert to ms
    });

    return { access_token: tokens.access_token };
  }
}

