/**
 * Example test file for the GraphQL mock server
 * You can use this as a template for writing your own tests
 */

const { createSchema } = require('../src/handler');
const { graphql } = require('graphql');
const paperStore = require('../src/mocks/paper-store');

describe('GraphQL Mock Server', () => {
  let schema;

  beforeAll(() => {
    schema = createSchema();
    // Clear store before each test
    paperStore.clear();
  });

  beforeEach(() => {
    paperStore.clear();
  });

  describe('CourseTemplate Mutations', () => {
    test('should create a course template', async () => {
      const mutation = `
        mutation CreateCourseTemplate($input: CourseTemplateCreateInput!) {
          courseTemplate {
            create(input: $input) {
              courseTemplate {
                id
                code
                title
                lifecycleState
              }
              errors {
                label
                message
                value
              }
            }
          }
        }
      `;

      const variables = {
        input: {
          code: 'TEST-001',
          title: 'Test Course Template',
          lifecycleState: 'draft',
        },
      };

      const result = await graphql({
        schema,
        source: mutation,
        variableValues: variables,
      });

      expect(result.errors).toBeUndefined();
      expect(result.data.courseTemplate.create.courseTemplate).toBeDefined();
      expect(result.data.courseTemplate.create.courseTemplate.code).toBe('TEST-001');
      expect(result.data.courseTemplate.create.courseTemplate.title).toBe('Test Course Template');
      expect(result.data.courseTemplate.create.errors).toEqual([]);
    });

    test('should return errors for invalid input', async () => {
      const mutation = `
        mutation CreateCourseTemplate($input: CourseTemplateCreateInput!) {
          courseTemplate {
            create(input: $input) {
              courseTemplate {
                id
              }
              errors {
                label
                message
                value
              }
            }
          }
        }
      `;

      const variables = {
        input: {
          code: '', // Empty code should trigger error
          title: '', // Empty title should trigger error
        },
      };

      const result = await graphql({
        schema,
        source: mutation,
        variableValues: variables,
      });

      expect(result.errors).toBeUndefined();
      expect(result.data.courseTemplate.create.courseTemplate).toBeNull();
      expect(result.data.courseTemplate.create.errors.length).toBeGreaterThan(0);
    });

    test('should update a course template', async () => {
      // First create a course template
      const createMutation = `
        mutation CreateCourseTemplate($input: CourseTemplateCreateInput!) {
          courseTemplate {
            create(input: $input) {
              courseTemplate {
                id
                code
                title
              }
              errors {
                label
                message
                value
              }
            }
          }
        }
      `;

      const createResult = await graphql({
        schema,
        source: createMutation,
        variableValues: {
          input: {
            code: 'TEST-001',
            title: 'Original Title',
          },
        },
      });

      const courseTemplateId = createResult.data.courseTemplate.create.courseTemplate.id;

      // Then update it
      const updateMutation = `
        mutation UpdateCourseTemplate($courseTemplateId: ID!, $input: CourseTemplateUpdateInput!) {
          courseTemplate {
            update(courseTemplateId: $courseTemplateId, input: $input) {
              courseTemplate {
                id
                code
                title
              }
              errors {
                label
                message
                value
              }
            }
          }
        }
      `;

      const updateResult = await graphql({
        schema,
        source: updateMutation,
        variableValues: {
          courseTemplateId,
          input: {
            title: 'Updated Title',
          },
        },
      });

      expect(updateResult.errors).toBeUndefined();
      expect(updateResult.data.courseTemplate.update.courseTemplate).toBeDefined();
      expect(updateResult.data.courseTemplate.update.courseTemplate.title).toBe('Updated Title');
      expect(updateResult.data.courseTemplate.update.errors).toEqual([]);
    });
  });

  describe('CourseTemplate Queries', () => {
    test('should query course templates', async () => {
      // Create some test data
      paperStore.createCourseTemplate({
        code: 'TEST-001',
        title: 'Test Course 1',
      });
      paperStore.createCourseTemplate({
        code: 'TEST-002',
        title: 'Test Course 2',
      });

      const query = `
        query CourseTemplatesQuery {
          courseTemplates {
            edges {
              node {
                id
                code
                title
                lifecycleState
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
        }
      `;

      const result = await graphql({
        schema,
        source: query,
      });

      expect(result.errors).toBeUndefined();
      expect(result.data.courseTemplates.edges.length).toBeGreaterThan(0);
      expect(result.data.courseTemplates.pageInfo).toBeDefined();
    });
  });
});

