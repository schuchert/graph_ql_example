/**
 * GraphQL handler setup
 * Configures the GraphQL schema with mock resolvers
 */

const { makeExecutableSchema } = require('@graphql-tools/schema');
const fs = require('fs');
const path = require('path');
const resolvers = require('./mocks/resolvers');

/**
 * Load the GraphQL schema from file
 */
function loadSchema() {
  const schemaPath = path.join(__dirname, 'schema.graphql');
  const schemaString = fs.readFileSync(schemaPath, 'utf8');
  return schemaString;
}

/**
 * Create executable schema with resolvers
 */
function createSchema() {
  let typeDefs = loadSchema();
  
  // Add mock-only utility types and mutations
  const mockExtensions = `
    # Mock-only utility mutation for clearing in-memory data
    type ClearAllDataResponse {
      success: Boolean!
      message: String!
      itemsCleared: Int!
    }
    
    extend type Mutation {
      clearAllData: ClearAllDataResponse!
    }
  `;
  
  typeDefs = [typeDefs, mockExtensions];
  
  // Create executable schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  return schema;
}

module.exports = {
  createSchema,
  loadSchema,
};

