import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { getUser } from 'src/auth/decorator/get-user.decorator';
import { jwtGuard } from 'src/auth/guard';

@UseGuards(jwtGuard)
@Controller('user')
export class UserController {
    @Get('me')
    getMe(@getUser() user:any) {
        return user;
    }

    @Patch()
    editUser(){
        return { message: 'Edit user endpoint (not implemented yet)' };
    }
}
