import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RequestTypeWithUser } from '../auth/types/auth.interface';

export const ReqUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestTypeWithUser>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

export const SocketUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<Socket>();
    const user = client.handshake.auth?.user;

    return data ? user?.[data] : user;
  },
);
