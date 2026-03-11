import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data ? user?.[data] : user;
  },
);
