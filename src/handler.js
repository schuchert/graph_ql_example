import graphqlMocks from 'graphql-mocks';
import { schema } from './schema.js';
import { createResolvers } from './mocks/resolvers.js';
import { PaperStore } from './mocks/paper-store.js';

const { GraphQLHandler } = graphqlMocks;

/**
 * Creates and configures the GraphQL handler with mocks
 * 
 * Uses Paper-like store for in-memory data storage.
 * The handler automatically mocks all fields not explicitly defined
 * in the resolverMap, making it easy to get started with realistic data.
 */
export function createHandler() {
  // Create Paper-like store instance for in-memory data storage
  const paper = { store: new PaperStore() };

  // Create resolvers with paper instance
  const { queryResolvers, mutationResolvers, fieldResolvers } = createResolvers(paper);

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
      paper,
    },
  });

  return handler;
}

