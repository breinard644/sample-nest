// guard/rt.guard.ts
import { createParamDecorator, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {} // <– must match strategy name

// Extract refresh token from request cookies
export const GetRefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies['refresh_token'];
  },
);

// Extract user (from validated JWT)
export const GetUser = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
