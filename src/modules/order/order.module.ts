import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [OrderService, OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
