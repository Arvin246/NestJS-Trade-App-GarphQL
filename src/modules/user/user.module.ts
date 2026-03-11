import { forwardRef, Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => OrderModule)],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
