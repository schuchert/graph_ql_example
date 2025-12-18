/**
 * Custom resolver functions for GraphQL mocks
 * These provide realistic mock data for integration testing
 * 
 * Uses GraphQL Paper for in-memory data storage.
 */

import { generateId, generateTimestamp } from '../utils/helpers.js';

// Helper to create connection structure
function createConnection(items, args = {}) {
  const allItems = Array.isArray(items) ? items : Array.from(items.values());
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
 * Creates resolver functions with Paper store
 */
export function createResolvers(paper) {
  const store = paper.store;

  /**
   * Custom resolvers for Query operations
   */
  const queryResolvers = {
    // CourseTemplate queries
    courseTemplates: (parent, args) => {
      const items = store.list('CourseTemplate');
      return createConnection(items, args);
    },
    
    courseTemplate: (parent, args) => {
      return store.get('CourseTemplate', args.id) || null;
    },
    
    // AchievementType queries
    achievementTypes: (parent, args) => {
      const items = store.list('AchievementType');
      return createConnection(items, args);
    },
    
    achievementType: (parent, args) => {
      return store.get('AchievementType', args.id) || null;
    },
    
    // LMS Content queries
    lmsContents: (parent, args) => {
      // LMS Content is a union, so we need to get all types
      const resources = store.list('LmsResourceType') || [];
      const externals = store.list('LmsExternalType') || [];
      const separators = store.list('LmsSeparatorType') || [];
      const allItems = [...resources, ...externals, ...separators];
      return createConnection(allItems, args);
    },
    
    lmsContent: (parent, args) => {
      // Try each type in the union
      return store.get('LmsResourceType', args.id) ||
             store.get('LmsExternalType', args.id) ||
             store.get('LmsSeparatorType', args.id) ||
             null;
    },
  };

  /**
   * Custom resolvers for Mutation operations
   * 
   * These mutations store entities using Paper store and return response objects.
   * Structure matches the generated Kotlin code: Mutation.courseTemplate.create()
   */
  const mutationResolvers = {
    // Nested CourseTemplate mutations (matching generated structure)
    courseTemplate: () => ({
      // CourseTemplate CRUD
      create: (parent, args) => {
        const now = generateTimestamp();
        const id = generateId('template');
        const courseTemplate = {
          id,
          legacyId: `legacy-${id}`,
          name: args.input.title, // For backward compatibility
          description: args.input.description || null,
          code: args.input.code,
          title: args.input.title,
          learningMode: args.input.learningMode || 'LMS',
          eventLearningMode: args.input.learningMode || 'LMS',
          lifecycleState: args.input.lifecycleState || 'ACTIVE',
          lmsContents: [],
          achievementTypes: [],
          createdAt: now,
          updatedAt: now,
        };
        
        store.add('CourseTemplate', courseTemplate);
        
        return {
          errors: [],
          courseTemplate,
        };
      },
      
      update: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
            courseTemplate: null,
          };
        }
        
        const now = generateTimestamp();
        const updates = {};
        if (args.input.title !== undefined) {
          updates.title = args.input.title;
          updates.name = args.input.title; // For backward compatibility
        }
        if (args.input.description !== undefined) updates.description = args.input.description;
        if (args.input.code !== undefined) updates.code = args.input.code;
        if (args.input.learningMode !== undefined) {
          updates.learningMode = args.input.learningMode;
          updates.eventLearningMode = args.input.learningMode;
        }
        if (args.input.lifecycleState !== undefined) updates.lifecycleState = args.input.lifecycleState;
        updates.updatedAt = now;
        
        const updated = store.update('CourseTemplate', args.courseTemplateId, updates);
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
      
      delete: (parent, args) => {
        const deleted = store.remove('CourseTemplate', args.courseTemplateId);
        return {
          errors: deleted === null ? [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }] : [],
          courseTemplate: deleted,
        };
      },
  
      // CourseTemplate LMS Content - Add
      addLmsContentTypeResource: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
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
          updatedAt: now,
        };
        
        store.add('LmsResourceType', content);
        
        const updatedLmsContents = [...(courseTemplate.lmsContents || []), content];
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          lmsContents: updatedLmsContents,
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
      
      addLmsContentTypeExternal: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
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
          updatedAt: now,
        };
        
        store.add('LmsExternalType', content);
        
        const updatedLmsContents = [...(courseTemplate.lmsContents || []), content];
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          lmsContents: updatedLmsContents,
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
      
      addLmsContentTypeSeparator: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
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
          updatedAt: now,
        };
        
        store.add('LmsSeparatorType', content);
        
        const updatedLmsContents = [...(courseTemplate.lmsContents || []), content];
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          lmsContents: updatedLmsContents,
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
  
      // CourseTemplate LMS Content - Update
      updateLmsContentTypeResource: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
            courseTemplate: null,
          };
        }
        
        const content = store.get('LmsResourceType', args.contentId);
        if (!content) {
          return {
            errors: [{ label: 'contentId', message: `LmsResourceType with ID ${args.contentId} not found`, value: args.contentId }],
            courseTemplate: null,
          };
        }
        
        const now = generateTimestamp();
        const updates = {};
        if (args.input.title !== undefined) updates.title = args.input.title;
        if (args.input.description !== undefined) updates.description = args.input.description;
        if (args.input.resourceUrl !== undefined) updates.resourceUrl = args.input.resourceUrl;
        if (args.input.order !== undefined) updates.order = args.input.order;
        if (args.input.autoComplete !== undefined) updates.autoComplete = args.input.autoComplete;
        if (args.input.displayName !== undefined) updates.displayName = args.input.displayName;
        if (args.input.documentId !== undefined) updates.documentId = args.input.documentId;
        updates.updatedAt = now;
        
        store.update('LmsResourceType', args.contentId, updates);
        
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
      
      updateLmsContentTypeExternal: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
            courseTemplate: null,
          };
        }
        
        const content = store.get('LmsExternalType', args.contentId);
        if (!content) {
          return {
            errors: [{ label: 'contentId', message: `LmsExternalType with ID ${args.contentId} not found`, value: args.contentId }],
            courseTemplate: null,
          };
        }
        
        const now = generateTimestamp();
        const updates = {};
        if (args.input.title !== undefined) updates.title = args.input.title;
        if (args.input.description !== undefined) updates.description = args.input.description;
        if (args.input.externalUrl !== undefined) updates.externalUrl = args.input.externalUrl;
        if (args.input.order !== undefined) updates.order = args.input.order;
        if (args.input.autoComplete !== undefined) updates.autoComplete = args.input.autoComplete;
        if (args.input.displayName !== undefined) updates.displayName = args.input.displayName;
        updates.updatedAt = now;
        
        store.update('LmsExternalType', args.contentId, updates);
        
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
      
      updateLmsContentTypeSeparator: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
            courseTemplate: null,
          };
        }
        
        const content = store.get('LmsSeparatorType', args.contentId);
        if (!content) {
          return {
            errors: [{ label: 'contentId', message: `LmsSeparatorType with ID ${args.contentId} not found`, value: args.contentId }],
            courseTemplate: null,
          };
        }
        
        const now = generateTimestamp();
        const updates = {};
        if (args.input.title !== undefined) updates.title = args.input.title;
        if (args.input.order !== undefined) updates.order = args.input.order;
        updates.updatedAt = now;
        
        store.update('LmsSeparatorType', args.contentId, updates);
        
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
    
      // CourseTemplate LMS Content - Remove
      removeLmsContentType: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
            courseTemplate: null,
          };
        }
        
        // Try to find and remove from each content type
        const resource = store.get('LmsResourceType', args.contentId);
        const external = store.get('LmsExternalType', args.contentId);
        const separator = store.get('LmsSeparatorType', args.contentId);
        
        if (resource) {
          store.remove('LmsResourceType', args.contentId);
        } else if (external) {
          store.remove('LmsExternalType', args.contentId);
        } else if (separator) {
          store.remove('LmsSeparatorType', args.contentId);
        }
        
        const updatedLmsContents = (courseTemplate.lmsContents || []).filter(c => c.id !== args.contentId);
        const now = generateTimestamp();
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          lmsContents: updatedLmsContents,
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
  
      // CourseTemplate AchievementType mutations
      addAchievementType: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
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
          lifecycleState: 'ACTIVE',
          createdAt: now,
          updatedAt: now,
        };
        
        store.add('AchievementType', achievementType);
        
        const courseAchievement = {
          id: generateId('course-achievement-link'),
          achievementType,
          autoAward: args.input.autoAward !== undefined ? args.input.autoAward : false,
        };
        
        const updatedAchievementTypes = [...(courseTemplate.achievementTypes || []), courseAchievement];
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          achievementTypes: updatedAchievementTypes,
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
    
      removeAchievementType: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
            courseTemplate: null,
          };
        }
        
        const updatedAchievementTypes = (courseTemplate.achievementTypes || []).filter(
          a => a.id !== args.achievementTypeId
        );
        
        const now = generateTimestamp();
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          achievementTypes: updatedAchievementTypes,
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
    
      updateAchievementType: (parent, args) => {
        const courseTemplate = store.get('CourseTemplate', args.courseTemplateId);
        if (!courseTemplate) {
          return {
            errors: [{ label: 'courseTemplateId', message: `CourseTemplate with ID ${args.courseTemplateId} not found`, value: args.courseTemplateId }],
            courseTemplate: null,
          };
        }
        
        const courseAchievement = (courseTemplate.achievementTypes || []).find(
          a => a.id === args.achievementTypeId
        );
        if (!courseAchievement) {
          return {
            errors: [{ label: 'achievementTypeId', message: `AchievementType with ID ${args.achievementTypeId} not found in course`, value: args.achievementTypeId }],
            courseTemplate: null,
          };
        }
        
        const now = generateTimestamp();
        const updatedAchievementTypes = (courseTemplate.achievementTypes || []).map(a => {
          if (a.id === args.achievementTypeId) {
            const updated = { ...a };
            if (args.input.autoAward !== undefined) updated.autoAward = args.input.autoAward;
            return updated;
          }
          return a;
        });
        
        const updated = store.update('CourseTemplate', args.courseTemplateId, {
          achievementTypes: updatedAchievementTypes,
          updatedAt: now,
        });
        
        return {
          errors: [],
          courseTemplate: updated,
        };
      },
    }),
  
    // Nested AchievementType mutations (matching generated structure)
    achievementType: () => ({
      create: (parent, args) => {
        const now = generateTimestamp();
        const id = generateId('achievement');
        const achievementType = {
          id,
          legacyId: `legacy-${id}`,
          name: args.input.name,
          description: args.input.description || null,
          lifecycleState: 'ACTIVE',
          createdAt: now,
          updatedAt: now,
        };
        
        store.add('AchievementType', achievementType);
        
        return {
          errors: [],
          achievementType,
        };
      },
    
      update: (parent, args) => {
        const achievementType = store.get('AchievementType', args.input.achievementTypeId);
        if (!achievementType) {
          return {
            errors: [{ label: 'achievementTypeId', message: `AchievementType with ID ${args.input.achievementTypeId} not found`, value: args.input.achievementTypeId }],
            achievementType: null,
          };
        }
        
        const now = generateTimestamp();
        const updates = {};
        if (args.input.name !== undefined) updates.name = args.input.name;
        if (args.input.description !== undefined) updates.description = args.input.description;
        if (args.input.isArchived !== undefined) {
          updates.lifecycleState = args.input.isArchived ? 'ARCHIVED' : 'ACTIVE';
        }
        updates.updatedAt = now;
        
        const updated = store.update('AchievementType', args.input.achievementTypeId, updates);
        
        return {
          errors: [],
          achievementType: updated,
        };
      },
    
      delete: (parent, args) => {
        const deleted = store.remove('AchievementType', args.achievementTypeId);
        return {
          errors: deleted === null ? [{ label: 'achievementTypeId', message: `AchievementType with ID ${args.achievementTypeId} not found`, value: args.achievementTypeId }] : [],
          achievementType: deleted,
        };
      },
    }),
  
    // Clear all data (for testing/development)
    clearAllData: (parent, args) => {
      const courseTemplates = store.list('CourseTemplate') || [];
      const achievementTypes = store.list('AchievementType') || [];
      const resources = store.list('LmsResourceType') || [];
      const externals = store.list('LmsExternalType') || [];
      const separators = store.list('LmsSeparatorType') || [];
      
      const courseTemplateCount = courseTemplates.length;
      const achievementTypeCount = achievementTypes.length;
      const lmsContentCount = resources.length + externals.length + separators.length;
      
      // Clear all entities
      courseTemplates.forEach(ct => store.remove('CourseTemplate', ct.id));
      achievementTypes.forEach(at => store.remove('AchievementType', at.id));
      resources.forEach(r => store.remove('LmsResourceType', r.id));
      externals.forEach(e => store.remove('LmsExternalType', e.id));
      separators.forEach(s => store.remove('LmsSeparatorType', s.id));
      
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
  const fieldResolvers = {
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

  return {
    queryResolvers,
    mutationResolvers,
    fieldResolvers,
  };
}
