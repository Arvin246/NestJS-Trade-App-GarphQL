import { ApolloDriverConfig } from '@nestjs/apollo';
import type { Request } from 'express';
import { join } from 'path';

/**
 * Shared GraphQL configuration for the API.
 * Keeps AppModule thin and centralizes options for future tuning (plugins, validation, etc.).
 */
export const graphqlConfig: ApolloDriverConfig = {
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  sortSchema: true,
  playground: true,
  context: ({ req }: { req: Request }) => ({ req }),
};
