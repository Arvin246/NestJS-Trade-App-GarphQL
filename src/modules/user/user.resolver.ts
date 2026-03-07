import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  users() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  user(@Args('id') id: string) {
    return this.userService.findOne(id);
  }
}
