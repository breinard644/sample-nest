import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, ForbiddenException, Get, Patch, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { getUser } from 'src/auth/decorator/get-user.decorator';

@ApiBearerAuth('access-token')
@ApiTags()
@UseInterceptors(CacheInterceptor)
@Controller('user')
export class UserController {
    @Get('me')
    getMe(@getUser() user:any) {
        // const { refreshToken, ...safeUser } = user;

        // Check if the refresh token exists in the request cookie
        // if (!refreshToken) {
        //     throw new ForbiddenException('Refresh token missing3');
        // }

        // // Optionally, you could validate the refresh token here, e.g., checking expiration

        // // Set the refresh token in the HTTP-only cookie
        // res.cookie('refresh_token', refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });
        
        return user;
    }

    @Patch()
    editUser(){
        return { message: 'Edit user endpoint (not implemented yet)' };
    }
}
