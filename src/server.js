/**
 * Main server entry point
 * Sets up Express server with Apollo Server for GraphQL
 */

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createSchema } = require('./handler');

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();

  // Create GraphQL schema
  const schema = createSchema();

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    introspection: true, // Enable GraphiQL
    playground: true, // Enable GraphQL Playground
    context: ({ req }) => {
      // You can add request context here if needed
      return {
        // Add any context you need (auth, user, etc.)
      };
    },
    formatError: (error) => {
      // Custom error formatting
      console.error('GraphQL Error:', error);
      return error;
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL Mock Server running at http://localhost:${PORT}/graphql`);
    console.log(`📚 GraphiQL available at http://localhost:${PORT}/graphql`);
    console.log(`\nReady to accept GraphQL queries and mutations!`);
  });
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

