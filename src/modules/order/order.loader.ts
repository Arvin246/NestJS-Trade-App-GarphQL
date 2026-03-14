import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

/**
 * Batches order lookups by userId to fix N+1 when resolving User.orders.
 * One loader per request (request-scoped) so each GraphQL request gets one batch.
 */
@Injectable({ scope: Scope.REQUEST })
export class OrderLoader {
  private loader: DataLoader<string, Order[]>;

  constructor(private readonly orderService: OrderService) {
    this.loader = new DataLoader<string, Order[]>((userIds) =>
      this.batchOrdersByUserId(userIds),
    );
  }

  load(userId: string): Promise<Order[]> {
    return this.loader.load(userId);
  }

  private async batchOrdersByUserId(
    userIds: readonly string[],
  ): Promise<Order[][]> {
    const orders = await this.orderService.findByUserIds(userIds);
    const byUserId = new Map<string, Order[]>();
    for (const order of orders) {
      const list = byUserId.get(order.userId) ?? [];
      list.push(order);
      byUserId.set(order.userId, list);
    }
    return userIds.map((id) => byUserId.get(id) ?? []);
  }
}
