import { Args, Query, Resolver } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order], { name: 'orders' })
  orders() {
    return this.orderService.findAll();
  }

  @Query(() => Order, { name: 'order', nullable: true })
  order(@Args('id') id: string) {
    return this.orderService.findOne(id);
  }
}
