/**
 * Utility functions for generating mock data
 */

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} A unique ID
 */
function generateId(prefix = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Generate a timestamp in ISO format
 * @returns {string} ISO timestamp string
 */
function generateTimestamp() {
  return new Date().toISOString();
}

/**
 * Generate a TimeZonedDateTime string
 * @returns {string} TimeZonedDateTime string
 */
function generateTimeZonedDateTime() {
  return new Date().toISOString();
}

/**
 * Generate a cursor for pagination
 * @param {number} index - Index of the item
 * @returns {string} Cursor string
 */
function generateCursor(index) {
  return Buffer.from(`cursor_${index}`).toString('base64');
}

/**
 * Create PageInfo for pagination
 * @param {Object} options - Pagination options
 * @param {boolean} options.hasNextPage - Whether there's a next page
 * @param {boolean} options.hasPreviousPage - Whether there's a previous page
 * @param {number} options.startCursor - Start cursor index
 * @param {number} options.endCursor - End cursor index
 * @returns {Object} PageInfo object
 */
function createPageInfo({ hasNextPage = false, hasPreviousPage = false, startCursor = 0, endCursor = 0, totalCount = 0 }) {
  // Always generate cursors, even if empty (use index 0 for empty results)
  const start = totalCount > 0 ? generateCursor(startCursor) : generateCursor(0);
  const end = totalCount > 0 ? generateCursor(Math.max(0, endCursor)) : generateCursor(0);
  
  return {
    hasNextPage,
    hasPreviousPage,
    startCursor: start,
    endCursor: end,
  };
}

/**
 * Create a connection object for pagination
 * @param {Array} items - Array of items
 * @param {Object} pageInfo - PageInfo object
 * @returns {Object} Connection object with edges and pageInfo
 */
function createConnection(items, pageInfo) {
  return {
    edges: items.map((node, index) => ({
      cursor: generateCursor(index),
      node,
    })),
    pageInfo,
  };
}

module.exports = {
  generateId,
  generateTimestamp,
  generateTimeZonedDateTime,
  generateCursor,
  createPageInfo,
  createConnection,
};

