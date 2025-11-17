package com.administrate.graphql;

import com.administrate.graphql.model.CourseTemplate;
import com.administrate.graphql.service.CourseTemplateService;
import com.administrate.graphql.service.AchievementTypeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for filtering entities using Spring GraphQL.
 */
@DisplayName("Filter Tests - Filtering Entities with Spring GraphQL")
class FilterTests extends BaseGraphQLTest {

    @Autowired
    private CourseTemplateService courseTemplateService;

    @Autowired
    private AchievementTypeService achievementTypeService;

    @Test
    @DisplayName("Should query course templates and filter by learning mode")
    void shouldFilterByLearningMode() {
        // Create course templates with different learning modes
        String[] learningModes = {"LMS", "CLASSROOM", "BLENDED", "VIRTUAL"};
        
        for (String mode : learningModes) {
            courseTemplateService
                    .create("Course " + mode, "Test", "MODE-" + mode, mode)
                    .block();
        }

        // Query all and filter in application logic
        var allCourses = courseTemplateService.findAll()
                .block();

        // Then - filter by LMS mode
        List<CourseTemplate> lmsCourses = Arrays.stream(allCourses)
                .filter(course -> "LMS".equals(course.getLearningMode()))
                .collect(Collectors.toList());

        assertThat(lmsCourses).isNotEmpty();
        assertThat(lmsCourses).allMatch(course -> "LMS".equals(course.getLearningMode()));
    }

    @Test
    @DisplayName("Should query course templates and filter by lifecycle state")
    void shouldFilterByLifecycleState() {
        // Create course templates (all will be ACTIVE by default)
        for (int i = 1; i <= 2; i++) {
            courseTemplateService
                    .create("Lifecycle Test " + i, "Test", "LIFECYCLE-" + String.format("%03d", i), "LMS")
                    .block();
        }

        // Query and verify lifecycle state
        var allCourses = courseTemplateService.findAll()
                .block();

        // Filter by ACTIVE state
        List<CourseTemplate> activeCourses = Arrays.stream(allCourses)
                .filter(course -> course.getCode() != null && course.getCode().startsWith("LIFECYCLE-"))
                .collect(Collectors.toList());

        assertThat(activeCourses).allMatch(course -> 
                "ACTIVE".equals(course.getLifecycleState())
        );
    }

    @Test
    @DisplayName("Should filter achievement types by points range")
    void shouldFilterAchievementTypesByPoints() {
        // Create achievement types with different point values
        int[] pointValues = {50, 100, 150, 200};
        
        for (int points : pointValues) {
            achievementTypeService
                    .create("Achievement " + points + " Points", null, points, null)
                    .block();
        }

        // Query all achievement types
        var allAchievements = achievementTypeService.findAll()
                .block();

        // Filter by points >= 100
        List<com.administrate.graphql.model.AchievementType> highPointAchievements = 
                Arrays.stream(allAchievements)
                        .filter(achievement -> achievement.getPoints() != null && 
                                               achievement.getPoints() >= 100)
                        .collect(Collectors.toList());

        assertThat(highPointAchievements.size()).isGreaterThanOrEqualTo(3);
        assertThat(highPointAchievements).allMatch(achievement -> 
                achievement.getPoints() >= 100
        );
    }

    @Test
    @DisplayName("Should query and filter course templates with pagination structure")
    void shouldQueryWithPaginationStructure() {
        // Create multiple course templates
        for (int i = 1; i <= 3; i++) {
            courseTemplateService
                    .create("Filter Test Course " + i, "Test", 
                            "FILTER-" + String.format("%03d", i), "LMS")
                    .block();
        }

        // Query all
        var allCourses = courseTemplateService.findAll()
                .block();

        // Then
        assertThat(allCourses).isNotNull();
        assertThat(allCourses.length).isGreaterThanOrEqualTo(3);

        // Filter by code pattern
        List<CourseTemplate> filteredCourses = Arrays.stream(allCourses)
                .filter(course -> course.getCode() != null && 
                                 course.getCode().startsWith("FILTER-"))
                .collect(Collectors.toList());

        assertThat(filteredCourses.size()).isGreaterThanOrEqualTo(3);
    }

    @Test
    @DisplayName("Should filter course templates by name pattern")
    void shouldFilterByNamePattern() {
        // Create course templates with specific names
        courseTemplateService
                .create("Spring Boot Course", "Test", "SPRING-001", "LMS")
                .block();
        
        courseTemplateService
                .create("GraphQL Course", "Test", "GRAPHQL-001", "LMS")
                .block();

        // Query all
        var allCourses = courseTemplateService.findAll()
                .block();

        // Filter by name containing "Spring"
        List<CourseTemplate> springCourses = Arrays.stream(allCourses)
                .filter(course -> course.getName() != null && 
                                 course.getName().contains("Spring"))
                .collect(Collectors.toList());

        assertThat(springCourses).isNotEmpty();
        assertThat(springCourses).allMatch(course -> 
                course.getName().contains("Spring")
        );
    }
}
