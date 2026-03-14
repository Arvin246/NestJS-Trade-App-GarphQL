import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { GqlContext } from '../../../common/types/gql-context';
import type { User } from '../../user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User | undefined => {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GqlContext>();
    return gqlContext.req?.user as User | undefined;
  },
);
