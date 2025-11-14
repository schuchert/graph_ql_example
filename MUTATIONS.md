# GraphQL Mutations Reference

Complete reference for all mutations available in the GraphQL mock server.

## CourseTemplate Mutations

### Create CourseTemplate

```graphql
mutation {
  createCourseTemplate(
    input: {
      name: "Introduction to GraphQL"
      description: "Learn the fundamentals of GraphQL"
    }
  ) {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

### Update CourseTemplate

```graphql
mutation {
  updateCourseTemplate(
    id: "template-123"
    input: {
      name: "Advanced GraphQL"
      description: "Updated description"
    }
  ) {
    id
    name
    description
    updatedAt
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
    }
  ) {
    id
    name
    lmsContentTypes {
      ... on LmsResourceType {
        id
        title
        resourceUrl
        order
      }
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
    }
  ) {
    id
    lmsContentTypes {
      ... on LmsExternalType {
        id
        title
        externalUrl
        order
      }
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
    id
    lmsContentTypes {
      ... on LmsSeparatorType {
        id
        title
        order
      }
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
    }
  ) {
    id
    lmsContentTypes {
      ... on LmsResourceType {
        id
        title
        resourceUrl
        order
      }
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
      externalUrl: "https://new-url.com"
      order: 6
    }
  ) {
    id
    lmsContentTypes {
      ... on LmsExternalType {
        id
        title
        externalUrl
        order
      }
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
    id
    lmsContentTypes {
      ... on LmsSeparatorType {
        id
        title
        order
      }
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
    id
    lmsContentTypes {
      ... on LmsResourceType {
        id
        title
      }
      ... on LmsExternalType {
        id
        title
      }
      ... on LmsSeparatorType {
        id
        title
      }
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
    }
  ) {
    id
    name
    description
    points
    badgeUrl
    createdAt
  }
}
```

### Update AchievementType

```graphql
mutation {
  updateAchievementType(
    id: "achievement-123"
    input: {
      name: "GraphQL Expert"
      description: "Updated description"
      points: 200
      badgeUrl: "https://example.com/new-badge.png"
    }
  ) {
    id
    name
    description
    points
    badgeUrl
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
    }
  ) {
    id
    achievementTypes {
      id
      name
      points
      badgeUrl
    }
  }
}
```

### Remove AchievementType from CourseTemplate

```graphql
mutation {
  courseTemplateRemoveAchievementType(
    courseTemplateId: "template-123"
    achievementId: "achievement-456"
  ) {
    id
    achievementTypes {
      id
      name
      points
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
    }
  ) {
    id
    name
  }
}

# 2. Add content to the course
mutation AddContent {
  courseTemplateAddLmsContentTypeResource(
    courseTemplateId: "template-123"
    input: {
      title: "Module 1: Introduction"
      resourceUrl: "https://example.com/module1"
      order: 1
    }
  ) {
    id
    lmsContentTypes {
      ... on LmsResourceType {
        id
        title
        order
      }
    }
  }
}

# 3. Add achievement to the course
mutation AddAchievement {
  courseTemplateAddAchievementType(
    courseTemplateId: "template-123"
    input: {
      name: "Course Completion Badge"
      points: 100
    }
  ) {
    id
    achievementTypes {
      id
      name
      points
    }
  }
}

# 4. Update the course
mutation UpdateCourse {
  updateCourseTemplate(
    id: "template-123"
    input: {
      name: "Updated Full Stack Development"
      description: "Updated course description"
    }
  ) {
    id
    name
    description
    updatedAt
  }
}
```

