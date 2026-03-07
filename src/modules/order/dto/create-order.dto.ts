import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  userId: string;

  @Field(() => [String], { description: 'Product IDs' })
  productIds: string[];
}
