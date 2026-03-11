import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Order } from '../order/entities/order.entity';
import { OrderService } from '../order/order.service';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  @Query(() => [User], { name: 'users' })
  users() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  user(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @ResolveField(() => [Order])
  orders(@Parent() user: User) {
    return this.orderService.findByUser(user.id);
  }
}
