/**
 * Custom resolver functions for GraphQL mocks
 * These provide realistic mock data for integration testing
 * 
 * Uses in-memory stores to persist data across queries and mutations.
 */

import { generateId, generateTimestamp } from '../utils/helpers.js';

// In-memory data stores
const courseTemplates = new Map();
const achievementTypes = new Map();
const lmsContents = new Map();

// Helper to create connection structure
function createConnection(items, args = {}) {
  const allItems = Array.from(items.values());
  const edges = allItems.map(item => ({
    node: item,
    cursor: Buffer.from(item.id).toString('base64'),
  }));
  
  return {
    edges,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    },
  };
}

/**
 * Custom resolvers for Query operations
 */
export const queryResolvers = {
  // CourseTemplate queries
  courseTemplates: (parent, args) => {
    return createConnection(courseTemplates, args);
  },
  
  courseTemplate: (parent, args) => {
    return courseTemplates.get(args.id) || null;
  },
  
  // AchievementType queries
  achievementTypes: (parent, args) => {
    return createConnection(achievementTypes, args);
  },
  
  achievementType: (parent, args) => {
    return achievementTypes.get(args.id) || null;
  },
  
  // LMS Content queries
  lmsContents: (parent, args) => {
    return createConnection(lmsContents, args);
  },
  
  lmsContent: (parent, args) => {
    return lmsContents.get(args.id) || null;
  },
};

/**
 * Custom resolvers for Mutation operations
 * 
 * These mutations store entities in memory and return response objects.
 */
export const mutationResolvers = {
  // CourseTemplate CRUD
  createCourseTemplate: (parent, args) => {
    const now = generateTimestamp();
    const id = generateId('template');
    const courseTemplate = {
      id,
      legacyId: `legacy-${id}`,
      name: args.input.name,
      description: args.input.description || null,
      code: args.input.code || null,
      title: args.input.title || args.input.name,
      learningMode: args.input.learningMode || 'LMS',
      lifecycleState: 'ACTIVE',
      lmsContents: [],
      achievementTypes: [],
      createdAt: now,
      updatedAt: now,
    };
    
    courseTemplates.set(id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  updateCourseTemplate: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.input.id);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'id', message: `CourseTemplate with ID ${args.input.id} not found` }],
        courseTemplate: null,
      };
    }
    
    const now = generateTimestamp();
    if (args.input.name !== undefined) courseTemplate.name = args.input.name;
    if (args.input.description !== undefined) courseTemplate.description = args.input.description;
    if (args.input.code !== undefined) courseTemplate.code = args.input.code;
    if (args.input.title !== undefined) courseTemplate.title = args.input.title;
    if (args.input.learningMode !== undefined) courseTemplate.learningMode = args.input.learningMode;
    courseTemplate.updatedAt = now;
    
    courseTemplates.set(courseTemplate.id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  deleteCourseTemplate: (parent, args) => {
    const deleted = courseTemplates.delete(args.id);
    return deleted;
  },
  
  // CourseTemplate LMS Content - Add
  courseTemplateAddLmsContentTypeResource: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const now = generateTimestamp();
    const contentId = generateId('lms-resource');
    const content = {
      id: contentId,
      legacyId: `legacy-${contentId}`,
      __typename: 'LmsResourceType',
      title: args.input.title,
      description: args.input.description || null,
      resourceUrl: args.input.resourceUrl || null,
      order: args.input.order || 0,
      autoComplete: args.input.autoComplete !== undefined ? args.input.autoComplete : false,
      displayName: args.input.displayName || null,
      documentId: args.input.documentId || null,
      createdAt: now,
    };
    
    courseTemplate.lmsContents.push(content);
    courseTemplate.updatedAt = now;
    lmsContents.set(contentId, content);
    courseTemplates.set(courseTemplate.id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  courseTemplateAddLmsContentTypeExternal: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const now = generateTimestamp();
    const contentId = generateId('lms-external');
    const content = {
      id: contentId,
      legacyId: `legacy-${contentId}`,
      __typename: 'LmsExternalType',
      title: args.input.title,
      description: args.input.description || null,
      externalUrl: args.input.externalUrl,
      order: args.input.order || 0,
      autoComplete: args.input.autoComplete !== undefined ? args.input.autoComplete : false,
      displayName: args.input.displayName || null,
      createdAt: now,
    };
    
    courseTemplate.lmsContents.push(content);
    courseTemplate.updatedAt = now;
    lmsContents.set(contentId, content);
    courseTemplates.set(courseTemplate.id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  courseTemplateAddLmsContentTypeSeparator: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const now = generateTimestamp();
    const contentId = generateId('lms-separator');
    const content = {
      id: contentId,
      legacyId: `legacy-${contentId}`,
      __typename: 'LmsSeparatorType',
      title: args.input.title,
      order: args.input.order || 0,
      createdAt: now,
    };
    
    courseTemplate.lmsContents.push(content);
    courseTemplate.updatedAt = now;
    lmsContents.set(contentId, content);
    courseTemplates.set(courseTemplate.id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  // CourseTemplate LMS Content - Update
  courseTemplateUpdateLmsContentTypeResource: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const content = courseTemplate.lmsContents.find(c => c.id === args.contentId && c.__typename === 'LmsResourceType');
    if (!content) {
      return {
        errors: [{ field: 'contentId', message: `LmsResourceType with ID ${args.contentId} not found` }],
        courseTemplate: null,
      };
    }
    
    const now = generateTimestamp();
    if (args.input.title !== undefined) content.title = args.input.title;
    if (args.input.description !== undefined) content.description = args.input.description;
    if (args.input.resourceUrl !== undefined) content.resourceUrl = args.input.resourceUrl;
    if (args.input.order !== undefined) content.order = args.input.order;
    if (args.input.autoComplete !== undefined) content.autoComplete = args.input.autoComplete;
    if (args.input.displayName !== undefined) content.displayName = args.input.displayName;
    if (args.input.documentId !== undefined) content.documentId = args.input.documentId;
    
    courseTemplate.updatedAt = now;
    lmsContents.set(content.id, content);
    courseTemplates.set(courseTemplate.id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  courseTemplateUpdateLmsContentTypeExternal: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const content = courseTemplate.lmsContents.find(c => c.id === args.contentId && c.__typename === 'LmsExternalType');
    if (!content) {
      return {
        errors: [{ field: 'contentId', message: `LmsExternalType with ID ${args.contentId} not found` }],
        courseTemplate: null,
      };
    }
    
    const now = generateTimestamp();
    if (args.input.title !== undefined) content.title = args.input.title;
    if (args.input.description !== undefined) content.description = args.input.description;
    if (args.input.externalUrl !== undefined) content.externalUrl = args.input.externalUrl;
    if (args.input.order !== undefined) content.order = args.input.order;
    if (args.input.autoComplete !== undefined) content.autoComplete = args.input.autoComplete;
    if (args.input.displayName !== undefined) content.displayName = args.input.displayName;
    
    courseTemplate.updatedAt = now;
    lmsContents.set(content.id, content);
    courseTemplates.set(courseTemplate.id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  courseTemplateUpdateLmsContentTypeSeparator: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const content = courseTemplate.lmsContents.find(c => c.id === args.contentId && c.__typename === 'LmsSeparatorType');
    if (!content) {
      return {
        errors: [{ field: 'contentId', message: `LmsSeparatorType with ID ${args.contentId} not found` }],
        courseTemplate: null,
      };
    }
    
    const now = generateTimestamp();
    if (args.input.title !== undefined) content.title = args.input.title;
    if (args.input.order !== undefined) content.order = args.input.order;
    
    courseTemplate.updatedAt = now;
    lmsContents.set(content.id, content);
    courseTemplates.set(courseTemplate.id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  // CourseTemplate LMS Content - Remove
  courseTemplateRemoveLmsContentType: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const initialLength = courseTemplate.lmsContents.length;
    courseTemplate.lmsContents = courseTemplate.lmsContents.filter(c => c.id !== args.contentId);
    
    if (courseTemplate.lmsContents.length < initialLength) {
      const now = generateTimestamp();
      courseTemplate.updatedAt = now;
      lmsContents.delete(args.contentId);
      courseTemplates.set(courseTemplate.id, courseTemplate);
    }
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  // AchievementType CRUD (standalone)
  createAchievementType: (parent, args) => {
    const now = generateTimestamp();
    const id = generateId('achievement');
    const achievementType = {
      id,
      legacyId: `legacy-${id}`,
      name: args.input.name,
      description: args.input.description || null,
      points: args.input.points || null,
      badgeUrl: args.input.badgeUrl || null,
      certificateTypeId: args.input.certificateTypeId || null,
      createdAt: now,
      updatedAt: now,
    };
    
    achievementTypes.set(id, achievementType);
    
    return {
      errors: [],
      achievementType,
    };
  },
  
  updateAchievementType: (parent, args) => {
    const achievementType = achievementTypes.get(args.input.id);
    if (!achievementType) {
      return {
        errors: [{ field: 'id', message: `AchievementType with ID ${args.input.id} not found` }],
        achievementType: null,
      };
    }
    
    const now = generateTimestamp();
    if (args.input.name !== undefined) achievementType.name = args.input.name;
    if (args.input.description !== undefined) achievementType.description = args.input.description;
    if (args.input.points !== undefined) achievementType.points = args.input.points;
    if (args.input.badgeUrl !== undefined) achievementType.badgeUrl = args.input.badgeUrl;
    if (args.input.certificateTypeId !== undefined) achievementType.certificateTypeId = args.input.certificateTypeId;
    achievementType.updatedAt = now;
    
    achievementTypes.set(achievementType.id, achievementType);
    
    return {
      errors: [],
      achievementType,
    };
  },
  
  deleteAchievementType: (parent, args) => {
    const deleted = achievementTypes.delete(args.id);
    return deleted;
  },
  
  // CourseTemplate AchievementType management
  courseTemplateAddAchievementType: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const now = generateTimestamp();
    const achievementId = generateId('course-achievement');
    const achievementType = {
      id: achievementId,
      legacyId: `legacy-${achievementId}`,
      name: args.input.name,
      description: args.input.description || null,
      points: args.input.points || null,
      badgeUrl: args.input.badgeUrl || null,
      certificateTypeId: args.input.certificateTypeId || null,
      createdAt: now,
      updatedAt: now,
    };
    
    const courseAchievement = {
      id: generateId('course-achievement-link'),
      achievementType,
      autoAward: args.input.autoAward !== undefined ? args.input.autoAward : false,
    };
    
    if (!courseTemplate.achievementTypes) {
      courseTemplate.achievementTypes = [];
    }
    courseTemplate.achievementTypes.push(courseAchievement);
    courseTemplate.updatedAt = now;
    achievementTypes.set(achievementId, achievementType);
    courseTemplates.set(courseTemplate.id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  courseTemplateRemoveAchievementType: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const initialLength = courseTemplate.achievementTypes ? courseTemplate.achievementTypes.length : 0;
    courseTemplate.achievementTypes = (courseTemplate.achievementTypes || []).filter(
      a => a.id !== args.achievementTypeId
    );
    
    if (courseTemplate.achievementTypes.length < initialLength) {
      const now = generateTimestamp();
      courseTemplate.updatedAt = now;
      courseTemplates.set(courseTemplate.id, courseTemplate);
    }
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  courseTemplateUpdateAchievementType: (parent, args) => {
    const courseTemplate = courseTemplates.get(args.courseTemplateId);
    if (!courseTemplate) {
      return {
        errors: [{ field: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found` }],
        courseTemplate: null,
      };
    }
    
    const courseAchievement = (courseTemplate.achievementTypes || []).find(
      a => a.id === args.achievementTypeId
    );
    if (!courseAchievement) {
      return {
        errors: [{ field: 'achievementTypeId', message: `AchievementType with ID ${args.achievementTypeId} not found in course` }],
        courseTemplate: null,
      };
    }
    
    const now = generateTimestamp();
    if (args.input.autoAward !== undefined) courseAchievement.autoAward = args.input.autoAward;
    if (args.input.points !== undefined && courseAchievement.achievementType) {
      courseAchievement.achievementType.points = args.input.points;
    }
    if (args.input.badgeUrl !== undefined && courseAchievement.achievementType) {
      courseAchievement.achievementType.badgeUrl = args.input.badgeUrl;
    }
    
    courseTemplate.updatedAt = now;
    courseTemplates.set(courseTemplate.id, courseTemplate);
    
    return {
      errors: [],
      courseTemplate,
    };
  },
  
  // Clear all data (for testing/development)
  clearAllData: (parent, args) => {
    const courseTemplateCount = courseTemplates.size;
    const achievementTypeCount = achievementTypes.size;
    const lmsContentCount = lmsContents.size;
    
    courseTemplates.clear();
    achievementTypes.clear();
    lmsContents.clear();
    
    return {
      success: true,
      message: 'All data cleared successfully',
      clearedCounts: {
        courseTemplates: courseTemplateCount,
        achievementTypes: achievementTypeCount,
        lmsContents: lmsContentCount,
      },
    };
  },
};

/**
 * Field-level resolvers for custom behavior
 */
export const fieldResolvers = {
  CourseTemplate: {
    // Return lmsContents as connection
    lmsContents: (parent) => {
      if (!parent.lmsContents || parent.lmsContents.length === 0) {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }
      
      const edges = parent.lmsContents.map(content => ({
        node: content,
        cursor: Buffer.from(content.id).toString('base64'),
      }));
      
      return {
        edges,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
      };
    },
    
    // Return achievementTypes as connection
    achievementTypes: (parent) => {
      if (!parent.achievementTypes || parent.achievementTypes.length === 0) {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }
      
      const edges = parent.achievementTypes.map(achievement => ({
        node: achievement,
        cursor: Buffer.from(achievement.id).toString('base64'),
      }));
      
      return {
        edges,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
      };
    },
    
    legacyId: (parent) => {
      return parent.legacyId || `legacy-${parent.id}`;
    },
    
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
