import { GraphQLHandler } from 'graphql-mocks';
import { schema } from './schema.js';
import { queryResolvers, mutationResolvers, fieldResolvers } from './mocks/resolvers.js';

/**
 * Creates and configures the GraphQL handler with mocks
 * 
 * The handler automatically mocks all fields not explicitly defined
 * in the resolverMap, making it easy to get started with realistic data.
 */
export function createHandler() {
  // Combine all resolvers
  const resolverMap = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    ...fieldResolvers,
  };

  // Create the handler
  // graphql-mocks will automatically mock any fields not in resolverMap
  const handler = new GraphQLHandler({
    resolverMap,
    dependencies: {
      graphqlSchema: schema,
    },
  });

  return handler;
}

