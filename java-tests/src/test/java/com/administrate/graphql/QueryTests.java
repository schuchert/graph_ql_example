package com.administrate.graphql;

import com.administrate.graphql.model.CourseTemplate;
import com.administrate.graphql.service.CourseTemplateService;
import com.administrate.graphql.service.AchievementTypeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.test.StepVerifier;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for reading/querying entities using Spring GraphQL.
 */
@DisplayName("Query Tests - Reading Entities with Spring GraphQL")
class QueryTests extends BaseGraphQLTest {

    @Autowired
    private CourseTemplateService courseTemplateService;

    @Autowired
    private AchievementTypeService achievementTypeService;

    @Test
    @DisplayName("Should query all course templates using Spring GraphQL")
    void shouldQueryAllCourseTemplates() {
        // When
        var result = courseTemplateService.findAll()
                .block();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(CourseTemplate[].class);
    }

    @Test
    @DisplayName("Should query a specific course template by ID")
    void shouldQueryCourseTemplateById() {
        // First, create a course template
        var createResult = courseTemplateService
                .create("Test Course for Query", "A test course", "TEST-QUERY-001", "LMS")
                .block();

        assertThat(createResult).isNotNull();
        assertThat(createResult.getErrors()).isEmpty();
        
        String courseTemplateId = createResult.getData().getId();

        // When - query it
        var result = courseTemplateService.findById(courseTemplateId)
                .block();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(courseTemplateId);
        assertThat(result.getName()).isEqualTo("Test Course for Query");
        assertThat(result.getCode()).isEqualTo("TEST-QUERY-001");
        assertThat(result.getLearningMode()).isEqualTo("LMS");
        assertThat(result.getLifecycleState()).isEqualTo("ACTIVE");
    }

    @Test
    @DisplayName("Should query all achievement types using Spring GraphQL")
    void shouldQueryAllAchievementTypes() {
        // When
        var result = achievementTypeService.findAll()
                .block();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(com.administrate.graphql.model.AchievementType[].class);
    }

    @Test
    @DisplayName("Should query course template with nested LMS contents")
    void shouldQueryCourseTemplateWithLmsContents() {
        // Create a course template
        var createResult = courseTemplateService
                .create("Course with Content", "Test", "CONTENT-001", "LMS")
                .block();

        String courseTemplateId = createResult.getData().getId();

        // Add LMS content using direct GraphQL client
        String addContentMutation = String.format("""
                mutation {
                  courseTemplateAddLmsContentTypeResource(
                    courseTemplateId: "%s"
                    input: {
                      title: "Introduction Video"
                      description: "Watch this first"
                      resourceUrl: "https://example.com/video"
                      order: 1
                      autoComplete: true
                    }
                  ) {
                    courseTemplate {
                      id
                    }
                  }
                }
                """, courseTemplateId);

        graphQlClient.document(addContentMutation)
                .execute()
                .block();

        // Query with nested content
        var result = courseTemplateService.findById(courseTemplateId)
                .block();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getLmsContents()).isNotNull();
        assertThat(result.getLmsContents().getEdges()).isNotEmpty();
    }

    @Test
    @DisplayName("Should query course template with achievement types")
    void shouldQueryCourseTemplateWithAchievementTypes() {
        // Create course template
        var createResult = courseTemplateService
                .create("Course with Achievements", "Test", "ACH-001", "LMS")
                .block();

        String courseTemplateId = createResult.getData().getId();

        // Add achievement using direct GraphQL client
        String addAchievementMutation = String.format("""
                mutation {
                  courseTemplateAddAchievementType(
                    courseTemplateId: "%s"
                    input: {
                      name: "Course Completion"
                      description: "Completed the course"
                      points: 100
                      badgeUrl: "https://example.com/badge.png"
                      autoAward: true
                    }
                  ) {
                    courseTemplate {
                      id
                    }
                  }
                }
                """, courseTemplateId);

        graphQlClient.document(addAchievementMutation)
                .execute()
                .block();

        // Query with achievements
        var result = courseTemplateService.findById(courseTemplateId)
                .block();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getAchievementTypes()).isNotNull();
        assertThat(result.getAchievementTypes().getEdges()).isNotEmpty();
    }

    @Test
    @DisplayName("Should use reactive streams with StepVerifier")
    void shouldUseReactiveStreams() {
        // When
        var flux = courseTemplateService.findAll()
                .flatMapMany(courses -> 
                    reactor.core.publisher.Flux.fromArray(courses)
                );

        // Then
        StepVerifier.create(flux)
                .expectNextCount(0) // At least 0 courses
                .verifyComplete();
    }
}
