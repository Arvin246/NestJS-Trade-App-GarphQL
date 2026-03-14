import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Order], { name: 'orders' })
  orders() {
    return this.orderService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Order, { name: 'order', nullable: true })
  order(@Args('id') id: string) {
    return this.orderService.findOne(id);
  }

  @ResolveField(() => User, { nullable: true })
  user(@Parent() order: Order) {
    return this.userService.findOne(order.userId);
  }

  @ResolveField(() => [Product])
  products(@Parent() order: Order) {
    return this.orderService.findProductsByOrderId(order.id);
  }
}
