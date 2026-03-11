import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }

  async findOne(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
    });
  }

  async findByUserIds(userIds: string[]): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId: { in: userIds } },
    });
  }

  async findProductsByOrderId(orderId: string): Promise<Product[]> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { product: true } } },
    });
    if (!order) return [];
    return order.orderItems.map((oi) => ({
      id: oi.product.id,
      name: oi.product.name,
      price: oi.product.price,
    }));
  }
}
