import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { dot } from 'node:test/reporters';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
      return this.authService.signup(dto); 
    }

    @Post('signin/:email/:password/:name')
    @ApiParam({ name: 'email', example: 'abc@example.com' })
    @ApiParam({ name: 'password', example: '123456' })
    @ApiParam({ name: 'name', example: 'binu' })
    signin(@Param('email') email: string,
    @Param('password') password: string,@Param('email') name: string){
        return this.authService.signin(email, password,name);
    }

    
}
