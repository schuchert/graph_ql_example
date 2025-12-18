/**
 * Mock resolvers for GraphQL schema
 * Structure matches the generated client code from Kotlin/Java
 */

const paperStore = require('./paper-store');
const { generateId, generateTimeZonedDateTime, createConnection, createPageInfo } = require('../utils/helpers');

/**
 * Query Resolvers
 */
const queryResolvers = {
  Query: {
    // Query: courseTemplates
    courseTemplates: (parent, args) => {
      const { first = 10, after, filters = [], order, orderBy = [] } = args;
      const allTemplates = paperStore.getAllCourseTemplates();
      
      // Simple pagination (you can enhance this with cursor-based logic)
      const startIndex = after ? parseInt(Buffer.from(after, 'base64').toString().split('_')[1]) || 0 : 0;
      const endIndex = startIndex + first;
      const pageItems = allTemplates.slice(startIndex, endIndex);
      
      const pageInfo = createPageInfo({
        hasNextPage: endIndex < allTemplates.length,
        hasPreviousPage: startIndex > 0,
        startCursor: startIndex,
        endCursor: Math.max(0, endIndex - 1),
        totalCount: allTemplates.length,
      });

      return createConnection(pageItems, pageInfo);
    },
  },
};

/**
 * Mutation Resolvers
 * Note: Structure matches the nested mutation pattern:
 * mutation { courseTemplate { create(...) } }
 */
const mutationResolvers = {
  Mutation: {
    // Mock-only utility mutation: clearAllData
    // This clears all in-memory data without restarting the server
    clearAllData: () => {
      try {
        const sizeBefore = paperStore.getSize();
        paperStore.clear();
        const totalCleared = Object.values(sizeBefore).reduce((sum, count) => sum + count, 0);
        return {
          success: true,
          message: `Cleared ${totalCleared} items from in-memory storage`,
          itemsCleared: totalCleared,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Failed to clear data',
          itemsCleared: 0,
        };
      }
    },

    // Root mutation: courseTemplate
    courseTemplate: () => ({}), // Return empty object, resolvers are in fieldResolvers
  },
};

/**
 * Field Resolvers
 * Custom resolvers for specific fields that need special handling
 */
const fieldResolvers = {
  CourseTemplate: {
    id: (parent) => parent.id,
    code: (parent) => parent.code,
    title: (parent) => parent.title,
    lifecycleState: (parent) => parent.lifecycleState || 'draft',
    updatedAt: (parent) => parent.updatedAt || generateTimeZonedDateTime(),
    createdAt: (parent) => parent.createdAt || generateTimeZonedDateTime(),
  },

  CourseTemplateConnection: {
    edges: (parent) => parent.edges || [],
    pageInfo: (parent) => parent.pageInfo || createPageInfo({}),
  },

  CourseTemplateEdge: {
    cursor: (parent) => parent.cursor,
    node: (parent) => parent.node,
  },

  PageInfo: {
    hasNextPage: (parent) => parent?.hasNextPage || false,
    hasPreviousPage: (parent) => parent?.hasPreviousPage || false,
    startCursor: (parent) => parent?.startCursor || generateCursor(0),
    endCursor: (parent) => parent?.endCursor || generateCursor(0),
  },

  FieldError: {
    label: (parent) => parent.label,
    message: (parent) => parent.message,
    value: (parent) => parent.value,
  },

  ClearAllDataResponse: {
    success: (parent) => parent.success,
    message: (parent) => parent.message,
    itemsCleared: (parent) => parent.itemsCleared,
  },

  CourseTemplateMutations: {
    create: (parent, args) => {
      const { input } = args || {};
      
      // Check if input is provided
      if (!input) {
        return {
          courseTemplate: null,
          errors: [{
            label: 'input',
            message: 'Input is required',
            value: null,
          }],
        };
      }
      
      // Validate required fields
      const errors = [];
      if (!input.code || (typeof input.code === 'string' && input.code.trim() === '')) {
        errors.push({
          label: 'code',
          message: 'Code is required',
          value: input.code || null,
        });
      }
      if (!input.title || (typeof input.title === 'string' && input.title.trim() === '')) {
        errors.push({
          label: 'title',
          message: 'Title is required',
          value: input.title || null,
        });
      }

      // If there are errors, return them
      if (errors.length > 0) {
        return {
          courseTemplate: null,
          errors,
        };
      }

      // Create the course template
      try {
        const courseTemplate = paperStore.createCourseTemplate(input);
        return {
          courseTemplate,
          errors: [],
        };
      } catch (error) {
        return {
          courseTemplate: null,
          errors: [{
            label: null,
            message: error.message || 'Failed to create course template',
            value: null,
          }],
        };
      }
    },

    update: (parent, args) => {
      const { courseTemplateId, input } = args || {};
      
      // Validate ID
      if (!courseTemplateId) {
        return {
          courseTemplate: null,
          errors: [{
            label: 'courseTemplateId',
            message: 'Course Template ID is required',
            value: null,
          }],
        };
      }

      // Check if exists
      const existing = paperStore.getCourseTemplateById(courseTemplateId);
      if (!existing) {
        return {
          courseTemplate: null,
          errors: [{
            label: 'courseTemplateId',
            message: `Course Template with ID ${courseTemplateId} not found`,
            value: courseTemplateId,
          }],
        };
      }

      // Update the course template
      try {
        const updated = paperStore.updateCourseTemplate(courseTemplateId, input);
        return {
          courseTemplate: updated,
          errors: [],
        };
      } catch (error) {
        return {
          courseTemplate: null,
          errors: [{
            label: null,
            message: error.message || 'Failed to update course template',
            value: null,
          }],
        };
      }
    },
  },
};

/**
 * Combine all resolvers
 */
const resolvers = {
  ...queryResolvers,
  ...mutationResolvers,
  ...fieldResolvers,
};

module.exports = resolvers;

