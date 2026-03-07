import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => Float)
  total: number;
}
