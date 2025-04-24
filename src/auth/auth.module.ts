import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/strategy';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { jwtGuard } from './guard';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

@Module({
  imports: [PrismaModule,JwtModule.register({}),forwardRef(() => AuthModule)],
  providers: [AuthService,JwtStrategy,RefreshTokenService, jwtGuard,JwtRefreshStrategy],
  exports:[RefreshTokenService, jwtGuard],
  controllers: [AuthController]
})
export class AuthModule {}
