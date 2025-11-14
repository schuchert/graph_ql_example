# GraphQL Mutations Reference

Complete reference for all mutations available in the Administrate DX GraphQL mock server.

## CourseTemplate Mutations

### Create CourseTemplate

```graphql
mutation {
  createCourseTemplate(
    input: {
      name: "Introduction to GraphQL"
      description: "Learn the fundamentals of GraphQL"
      code: "GRP-101"
      title: "Introduction to GraphQL Course"
      learningMode: LMS
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      legacyId
      name
      description
      code
      title
      learningMode
      lifecycleState
      createdAt
      updatedAt
    }
  }
}
```

### Update CourseTemplate

```graphql
mutation {
  updateCourseTemplate(
    input: {
      id: "template-123"
      name: "Advanced GraphQL"
      description: "Updated description"
      code: "GRP-201"
      title: "Advanced GraphQL Course"
      learningMode: BLENDED
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      description
      code
      title
      learningMode
      lifecycleState
      updatedAt
    }
  }
}
```

### Delete CourseTemplate

```graphql
mutation {
  deleteCourseTemplate(id: "template-123")
}
```

## LMS Content Type Mutations

### Add Resource to CourseTemplate

```graphql
mutation {
  courseTemplateAddLmsContentTypeResource(
    courseTemplateId: "template-123"
    input: {
      title: "GraphQL Basics"
      description: "Introduction to GraphQL concepts"
      resourceUrl: "https://example.com/resource"
      order: 1
      autoComplete: true
      displayName: "Intro Video"
      documentId: "doc-456"
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

### Add External Link to CourseTemplate

```graphql
mutation {
  courseTemplateAddLmsContentTypeExternal(
    courseTemplateId: "template-123"
    input: {
      title: "External Documentation"
      description: "Link to external resources"
      externalUrl: "https://graphql.org"
      order: 2
      autoComplete: false
      displayName: "GraphQL Docs"
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

### Add Separator to CourseTemplate

```graphql
mutation {
  courseTemplateAddLmsContentTypeSeparator(
    courseTemplateId: "template-123"
    input: {
      title: "Section Break"
      order: 3
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

### Update Resource in CourseTemplate

```graphql
mutation {
  courseTemplateUpdateLmsContentTypeResource(
    courseTemplateId: "template-123"
    contentId: "content-456"
    input: {
      title: "Updated Title"
      description: "Updated description"
      resourceUrl: "https://example.com/new-resource"
      order: 5
      autoComplete: false
      displayName: "Updated Display Name"
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

### Update External Link in CourseTemplate

```graphql
mutation {
  courseTemplateUpdateLmsContentTypeExternal(
    courseTemplateId: "template-123"
    contentId: "content-456"
    input: {
      title: "Updated External Link"
      description: "Updated description"
      externalUrl: "https://new-url.com"
      order: 6
      displayName: "New Link Name"
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

### Update Separator in CourseTemplate

```graphql
mutation {
  courseTemplateUpdateLmsContentTypeSeparator(
    courseTemplateId: "template-123"
    contentId: "content-456"
    input: {
      title: "Updated Separator"
      order: 7
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

### Remove Content Type from CourseTemplate

```graphql
mutation {
  courseTemplateRemoveLmsContentType(
    courseTemplateId: "template-123"
    contentId: "content-456"
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

## AchievementType Mutations (Standalone)

### Create AchievementType

```graphql
mutation {
  createAchievementType(
    input: {
      name: "GraphQL Master"
      description: "Completed all GraphQL modules"
      points: 100
      badgeUrl: "https://example.com/badge.png"
      certificateTypeId: "cert-123"
    }
  ) {
    errors {
      field
      message
    }
    achievementType {
      id
      legacyId
      name
      description
      points
      badgeUrl
      createdAt
      updatedAt
    }
  }
}
```

### Update AchievementType

```graphql
mutation {
  updateAchievementType(
    input: {
      id: "achievement-123"
      name: "GraphQL Expert"
      description: "Updated description"
      points: 200
      badgeUrl: "https://example.com/new-badge.png"
      certificateTypeId: "cert-456"
    }
  ) {
    errors {
      field
      message
    }
    achievementType {
      id
      name
      description
      points
      badgeUrl
      updatedAt
    }
  }
}
```

### Delete AchievementType

```graphql
mutation {
  deleteAchievementType(id: "achievement-123")
}
```

## CourseTemplate Achievement Management

### Add AchievementType to CourseTemplate

```graphql
mutation {
  courseTemplateAddAchievementType(
    courseTemplateId: "template-123"
    input: {
      name: "Course Completion"
      description: "Completed the course"
      points: 50
      badgeUrl: "https://example.com/completion-badge.png"
      autoAward: true
      certificateTypeId: "cert-123"
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      achievementTypes {
        edges {
          node {
            id
            achievementType {
              id
              name
              points
              badgeUrl
            }
            autoAward
          }
        }
      }
    }
  }
}
```

### Update AchievementType on CourseTemplate

```graphql
mutation {
  courseTemplateUpdateAchievementType(
    courseTemplateId: "template-123"
    achievementTypeId: "achievement-456"
    input: {
      autoAward: false
      points: 150
      badgeUrl: "https://example.com/updated-badge.png"
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

### Remove AchievementType from CourseTemplate

```graphql
mutation {
  courseTemplateRemoveAchievementType(
    courseTemplateId: "template-123"
    achievementTypeId: "achievement-456"
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

## Complete Example: Full Workflow

```graphql
# 1. Create a course template
mutation CreateCourse {
  createCourseTemplate(
    input: {
      name: "Full Stack Development"
      description: "Complete full stack course"
      code: "FSD-101"
      title: "Full Stack Development Course"
      learningMode: BLENDED
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      code
      learningMode
      lifecycleState
    }
  }
}

# 2. Add content to the course
mutation AddContent {
  courseTemplateAddLmsContentTypeResource(
    courseTemplateId: "template-123"
    input: {
      title: "Module 1: Introduction"
      description: "Introduction to full stack development"
      resourceUrl: "https://example.com/module1"
      order: 1
      autoComplete: true
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
    }
  }
}

# 3. Add external link
mutation AddExternalLink {
  courseTemplateAddLmsContentTypeExternal(
    courseTemplateId: "template-123"
    input: {
      title: "External Resources"
      description: "Additional learning materials"
      externalUrl: "https://example.com/resources"
      order: 2
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
    }
  }
}

# 4. Add achievement to the course
mutation AddAchievement {
  courseTemplateAddAchievementType(
    courseTemplateId: "template-123"
    input: {
      name: "Course Completion Badge"
      description: "Awarded upon course completion"
      points: 100
      badgeUrl: "https://example.com/badge.png"
      autoAward: true
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      achievementTypes {
        edges {
          node {
            achievementType {
              id
              name
              points
            }
            autoAward
          }
        }
      }
    }
  }
}

# 5. Update the course
mutation UpdateCourse {
  updateCourseTemplate(
    input: {
      id: "template-123"
      name: "Updated Full Stack Development"
      description: "Updated course description"
      code: "FSD-101-UPDATED"
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      description
      code
      updatedAt
    }
  }
}
```
