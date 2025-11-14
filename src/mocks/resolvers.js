/**
 * Custom resolver functions for GraphQL mocks
 * These provide realistic mock data for integration testing
 * 
 * Note: graphql-mocks will automatically mock fields not defined here
 * with realistic fake data based on the schema types.
 */

/**
 * Custom resolvers for Query operations
 * 
 * Returning empty arrays or objects allows graphql-mocks to
 * automatically generate mock data based on the schema.
 */
export const queryResolvers = {
  courseTemplates: () => {
    // Return array - graphql-mocks will generate mock CourseTemplate objects
    return [];
  },
  
  courseTemplate: (parent, args, context) => {
    // Return object with id - graphql-mocks will fill in other fields
    return { id: args.id };
  },
  
  achievementTypes: () => {
    // Return array - graphql-mocks will generate mock AchievementType objects
    return [];
  },
  
  achievementType: (parent, args) => {
    // Return object with id - graphql-mocks will fill in other fields
    return { id: args.id };
  },
};

/**
 * Custom resolvers for Mutation operations
 * 
 * These mutations return the updated entities.
 * In a real implementation, you would use the paper store to persist changes.
 */
export const mutationResolvers = {
  // CourseTemplate CRUD
  createCourseTemplate: (parent, args, context) => {
    const now = new Date().toISOString();
    return {
      id: `template-${Date.now()}`,
      name: args.input.name,
      description: args.input.description,
      createdAt: now,
      updatedAt: now,
    };
  },
  
  updateCourseTemplate: (parent, args, context) => {
    const now = new Date().toISOString();
    return {
      id: args.id,
      name: args.input.name,
      description: args.input.description,
      updatedAt: now,
    };
  },
  
  deleteCourseTemplate: (parent, args, context) => {
    // Return true to indicate successful deletion
    return true;
  },
  
  // CourseTemplate content management - Add
  courseTemplateAddLmsContentTypeResource: (parent, args, context) => {
    return { id: args.courseTemplateId };
  },
  
  courseTemplateAddLmsContentTypeExternal: (parent, args, context) => {
    return { id: args.courseTemplateId };
  },
  
  courseTemplateAddLmsContentTypeSeparator: (parent, args, context) => {
    return { id: args.courseTemplateId };
  },
  
  // CourseTemplate content management - Update
  courseTemplateUpdateLmsContentTypeResource: (parent, args, context) => {
    return { id: args.courseTemplateId };
  },
  
  courseTemplateUpdateLmsContentTypeExternal: (parent, args, context) => {
    return { id: args.courseTemplateId };
  },
  
  courseTemplateUpdateLmsContentTypeSeparator: (parent, args, context) => {
    return { id: args.courseTemplateId };
  },
  
  // CourseTemplate content management - Remove
  courseTemplateRemoveLmsContentType: (parent, args, context) => {
    return { id: args.courseTemplateId };
  },
  
  // AchievementType CRUD (standalone)
  createAchievementType: (parent, args, context) => {
    const now = new Date().toISOString();
    return {
      id: `achievement-${Date.now()}`,
      name: args.input.name,
      description: args.input.description,
      points: args.input.points,
      badgeUrl: args.input.badgeUrl,
      createdAt: now,
    };
  },
  
  updateAchievementType: (parent, args, context) => {
    return {
      id: args.id,
      name: args.input.name,
      description: args.input.description,
      points: args.input.points,
      badgeUrl: args.input.badgeUrl,
    };
  },
  
  deleteAchievementType: (parent, args, context) => {
    return true;
  },
  
  // CourseTemplate achievement management
  courseTemplateAddAchievementType: (parent, args, context) => {
    return { id: args.courseTemplateId };
  },
  
  courseTemplateRemoveAchievementType: (parent, args, context) => {
    return { id: args.courseTemplateId };
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
    // Customize lmsContentTypes if needed
    // lmsContentTypes: (parent) => [],
    
    // Customize achievementTypes if needed
    // achievementTypes: (parent) => [],
  },
};

