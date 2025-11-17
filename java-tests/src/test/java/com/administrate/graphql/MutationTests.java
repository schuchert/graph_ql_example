package com.administrate.graphql;

import com.administrate.graphql.model.CourseTemplate;
import com.administrate.graphql.model.AchievementType;
import com.administrate.graphql.model.MutationResponse;
import com.administrate.graphql.service.CourseTemplateService;
import com.administrate.graphql.service.AchievementTypeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.test.StepVerifier;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for writing/creating/updating/deleting entities using Spring GraphQL.
 */
@DisplayName("Mutation Tests - Writing Entities with Spring GraphQL")
class MutationTests extends BaseGraphQLTest {

    @Autowired
    private CourseTemplateService courseTemplateService;

    @Autowired
    private AchievementTypeService achievementTypeService;

    @Test
    @DisplayName("Should create a course template using Spring GraphQL")
    void shouldCreateCourseTemplate() {
        // When
        var result = courseTemplateService
                .create("Java Test Course", "A course created from Java tests", 
                        "JAVA-001", "LMS")
                .block();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getErrors()).isEmpty();
        
        CourseTemplate courseTemplate = result.getData();
        assertThat(courseTemplate).isNotNull();
        assertThat(courseTemplate.getId()).isNotBlank();
        assertThat(courseTemplate.getName()).isEqualTo("Java Test Course");
        assertThat(courseTemplate.getDescription()).isEqualTo("A course created from Java tests");
        assertThat(courseTemplate.getCode()).isEqualTo("JAVA-001");
        assertThat(courseTemplate.getLearningMode()).isEqualTo("LMS");
        assertThat(courseTemplate.getLifecycleState()).isEqualTo("ACTIVE");
        assertThat(courseTemplate.getCreatedAt()).isNotNull();
        assertThat(courseTemplate.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should update a course template using Spring GraphQL")
    void shouldUpdateCourseTemplate() {
        // First, create a course template
        var createResult = courseTemplateService
                .create("Original Name", "Original", "UPDATE-001", "LMS")
                .block();

        String courseTemplateId = createResult.getData().getId();

        // When - update it
        var updateResult = courseTemplateService
                .update(courseTemplateId, "Updated Name", "Updated description", "UPDATE-001-UPDATED")
                .block();

        // Then
        assertThat(updateResult).isNotNull();
        assertThat(updateResult.getErrors()).isEmpty();
        
        CourseTemplate courseTemplate = updateResult.getData();
        assertThat(courseTemplate.getId()).isEqualTo(courseTemplateId);
        assertThat(courseTemplate.getName()).isEqualTo("Updated Name");
        assertThat(courseTemplate.getDescription()).isEqualTo("Updated description");
        assertThat(courseTemplate.getCode()).isEqualTo("UPDATE-001-UPDATED");
    }

    @Test
    @DisplayName("Should delete a course template using Spring GraphQL")
    void shouldDeleteCourseTemplate() {
        // First, create a course template
        var createResult = courseTemplateService
                .create("To Be Deleted", "Test", "DELETE-001", "LMS")
                .block();

        String courseTemplateId = createResult.getData().getId();

        // When - delete it
        var deleteResult = courseTemplateService.delete(courseTemplateId)
                .block();

        // Then
        assertThat(deleteResult).isTrue();

        // Verify it's deleted
        var queryResult = courseTemplateService.findById(courseTemplateId)
                .block();
        assertThat(queryResult).isNull();
    }

    @Test
    @DisplayName("Should create an achievement type using Spring GraphQL")
    void shouldCreateAchievementType() {
        // When
        var result = achievementTypeService
                .create("Java Test Achievement", "Achievement created from Java test", 
                        150, "https://example.com/java-badge.png")
                .block();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getErrors()).isEmpty();
        
        AchievementType achievementType = result.getData();
        assertThat(achievementType).isNotNull();
        assertThat(achievementType.getId()).isNotBlank();
        assertThat(achievementType.getName()).isEqualTo("Java Test Achievement");
        assertThat(achievementType.getDescription()).isEqualTo("Achievement created from Java test");
        assertThat(achievementType.getPoints()).isEqualTo(150);
        assertThat(achievementType.getBadgeUrl()).isEqualTo("https://example.com/java-badge.png");
    }

    @Test
    @DisplayName("Should update an achievement type using Spring GraphQL")
    void shouldUpdateAchievementType() {
        // First, create an achievement type
        var createResult = achievementTypeService
                .create("Original Achievement", "Original", 100, null)
                .block();

        String achievementTypeId = createResult.getData().getId();

        // When - update it
        var updateResult = achievementTypeService
                .update(achievementTypeId, "Updated Achievement", "Updated description", 
                        200, "https://example.com/updated.png")
                .block();

        // Then
        assertThat(updateResult).isNotNull();
        assertThat(updateResult.getErrors()).isEmpty();
        
        AchievementType achievementType = updateResult.getData();
        assertThat(achievementType.getId()).isEqualTo(achievementTypeId);
        assertThat(achievementType.getName()).isEqualTo("Updated Achievement");
        assertThat(achievementType.getDescription()).isEqualTo("Updated description");
        assertThat(achievementType.getPoints()).isEqualTo(200);
    }

    @Test
    @DisplayName("Should delete an achievement type using Spring GraphQL")
    void shouldDeleteAchievementType() {
        // First, create an achievement type
        var createResult = achievementTypeService
                .create("To Be Deleted", "Test", 50, null)
                .block();

        String achievementTypeId = createResult.getData().getId();

        // When - delete it
        var deleteResult = achievementTypeService.delete(achievementTypeId)
                .block();

        // Then
        assertThat(deleteResult).isTrue();

        // Verify it's deleted
        var queryResult = achievementTypeService.findById(achievementTypeId)
                .block();
        assertThat(queryResult).isNull();
    }

    @Test
    @DisplayName("Should handle reactive mutations with StepVerifier")
    void shouldHandleReactiveMutations() {
        // When
        var mono = courseTemplateService
                .create("Reactive Test", "Test", "REACTIVE-001", "LMS");

        // Then
        StepVerifier.create(mono)
                .assertNext(result -> {
                    assertThat(result).isNotNull();
                    assertThat(result.getErrors()).isEmpty();
                    assertThat(result.getData()).isNotNull();
                })
                .verifyComplete();
    }
}
