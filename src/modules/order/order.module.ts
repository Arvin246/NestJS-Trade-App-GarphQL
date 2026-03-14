import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { OrderLoader } from './order.loader';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => UserModule)],
  providers: [OrderService, OrderLoader, OrderResolver],
  exports: [OrderService, OrderLoader],
})
export class OrderModule {}
