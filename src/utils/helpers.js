/**
 * Utility functions for the GraphQL mock server
 */

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'mock') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a timestamp in ISO format
 */
export function generateTimestamp() {
  return new Date().toISOString();
}

/**
 * Validate that required fields are present in an input object
 */
export function validateRequired(input, requiredFields) {
  const missing = requiredFields.filter(field => !(field in input));
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  return true;
}

