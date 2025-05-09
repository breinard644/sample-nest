import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/strategy';
import { RefreshTokensProvider } from './provider/refresh-tokens.provider';

@Module({
  imports: [PrismaModule,
    forwardRef(() => AuthModule),
    JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: `${process.env.REFRESH_JWT_EXPIRE || 86400}s` },
  }),
  forwardRef(() => AuthModule)],
  providers: [AuthService,JwtStrategy, RefreshTokensProvider],
  exports:[RefreshTokensProvider,JwtModule],
  controllers: [AuthController]
})
export class AuthModule {}
