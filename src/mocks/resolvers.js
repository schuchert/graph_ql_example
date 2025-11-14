/**
 * Custom resolver functions for GraphQL mocks
 * These provide realistic mock data for integration testing
 * 
 * Note: graphql-mocks will automatically mock fields not defined here
 * with realistic fake data based on the schema types.
 */

import { generateId, generateTimestamp } from '../utils/helpers.js';

/**
 * Custom resolvers for Query operations
 * 
 * Returning empty arrays or objects allows graphql-mocks to
 * automatically generate mock data based on the schema.
 */
export const queryResolvers = {
  // CourseTemplate queries
  courseTemplates: (parent, args) => {
    // Return connection structure - graphql-mocks will generate mock data
    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  },
  
  courseTemplate: (parent, args) => {
    // Return object with id - graphql-mocks will fill in other fields
    return {
      id: args.id,
      legacyId: `legacy-${args.id}`,
      lifecycleState: 'ACTIVE',
    };
  },
  
  // AchievementType queries
  achievementTypes: (parent, args) => {
    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  },
  
  achievementType: (parent, args) => {
    return {
      id: args.id,
      legacyId: `legacy-${args.id}`,
    };
  },
  
  // LMS Content queries
  lmsContents: (parent, args) => {
    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  },
  
  lmsContent: (parent, args) => {
    return { id: args.id };
  },
};

/**
 * Custom resolvers for Mutation operations
 * 
 * These mutations return response objects with errors and the mutated entity.
 */
export const mutationResolvers = {
  // CourseTemplate CRUD
  createCourseTemplate: (parent, args) => {
    const now = generateTimestamp();
    const id = generateId('template');
    return {
      errors: [],
      courseTemplate: {
        id,
        legacyId: `legacy-${id}`,
        name: args.input.name,
        description: args.input.description || null,
        code: args.input.code || null,
        title: args.input.title || args.input.name,
        learningMode: args.input.learningMode || 'LMS',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  updateCourseTemplate: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.input.id,
        legacyId: `legacy-${args.input.id}`,
        name: args.input.name || 'Updated Course',
        description: args.input.description,
        code: args.input.code,
        title: args.input.title,
        learningMode: args.input.learningMode,
        lifecycleState: 'ACTIVE',
        updatedAt: now,
      },
    };
  },
  
  deleteCourseTemplate: () => {
    return true;
  },
  
  // CourseTemplate LMS Content - Add
  courseTemplateAddLmsContentTypeResource: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  courseTemplateAddLmsContentTypeExternal: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  courseTemplateAddLmsContentTypeSeparator: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  // CourseTemplate LMS Content - Update
  courseTemplateUpdateLmsContentTypeResource: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  courseTemplateUpdateLmsContentTypeExternal: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  courseTemplateUpdateLmsContentTypeSeparator: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  // CourseTemplate LMS Content - Remove
  courseTemplateRemoveLmsContentType: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  // AchievementType CRUD (standalone)
  createAchievementType: (parent, args) => {
    const now = generateTimestamp();
    const id = generateId('achievement');
    return {
      errors: [],
      achievementType: {
        id,
        legacyId: `legacy-${id}`,
        name: args.input.name,
        description: args.input.description || null,
        points: args.input.points || null,
        badgeUrl: args.input.badgeUrl || null,
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  updateAchievementType: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      achievementType: {
        id: args.input.id,
        legacyId: `legacy-${args.input.id}`,
        name: args.input.name || 'Updated Achievement',
        description: args.input.description,
        points: args.input.points,
        badgeUrl: args.input.badgeUrl,
        updatedAt: now,
      },
    };
  },
  
  deleteAchievementType: () => {
    return true;
  },
  
  // CourseTemplate AchievementType management
  courseTemplateAddAchievementType: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  courseTemplateRemoveAchievementType: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
  
  courseTemplateUpdateAchievementType: (parent, args) => {
    const now = generateTimestamp();
    return {
      errors: [],
      courseTemplate: {
        id: args.courseTemplateId,
        legacyId: `legacy-${args.courseTemplateId}`,
        name: 'Course Template',
        lifecycleState: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
    };
  },
};

/**
 * Field-level resolvers for custom behavior
 * 
 * These can be used to customize specific field resolution logic.
 * Leaving them empty allows graphql-mocks to auto-generate data.
 */
export const fieldResolvers = {
  CourseTemplate: {
    // Ensure legacyId is always present
    legacyId: (parent) => {
      return parent.legacyId || `legacy-${parent.id}`;
    },
    
    // Default lifecycleState if not provided
    lifecycleState: (parent) => {
      return parent.lifecycleState || 'ACTIVE';
    },
  },
  
  AchievementType: {
    legacyId: (parent) => {
      return parent.legacyId || `legacy-${parent.id}`;
    },
  },
  
  LmsResourceType: {
    legacyId: (parent) => {
      return parent.legacyId || `legacy-${parent.id}`;
    },
    autoComplete: (parent) => {
      return parent.autoComplete !== undefined ? parent.autoComplete : false;
    },
  },
  
  LmsExternalType: {
    legacyId: (parent) => {
      return parent.legacyId || `legacy-${parent.id}`;
    },
    autoComplete: (parent) => {
      return parent.autoComplete !== undefined ? parent.autoComplete : false;
    },
  },
  
  LmsSeparatorType: {
    legacyId: (parent) => {
      return parent.legacyId || `legacy-${parent.id}`;
    },
  },
};
