package com.administrate.graphql;

import com.administrate.graphql.model.CourseTemplate;
import com.administrate.graphql.model.CreateCourseTemplateResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.client.HttpGraphQlClient;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {GraphQLApplication.class, CourseTemplateTest.TestConfig.class})
@TestPropertySource(properties = {
        "graphql.server.url=http://localhost:4000"
})
@DisplayName("Course Template Tests")
class CourseTemplateTest {

    @Configuration
    static class TestConfig {
        @Bean
        public WebClient webClient() {
            return WebClient.builder()
                    .baseUrl("http://localhost:4000/graphql")
                    .build();
        }

        @Bean
        public HttpGraphQlClient graphQlClient(WebClient webClient) {
            return HttpGraphQlClient.builder(webClient)
                    .build();
        }
    }

    @Autowired
    private HttpGraphQlClient graphQlClient;

    @Test
    @DisplayName("Should create a course template and verify it exists")
    void shouldCreateCourseTemplateAndVerifyItExists() {
        // Given - Create a course template
        String mutation = """
                mutation {
                  createCourseTemplate(
                    input: {
                      name: "Test Course"
                      description: "A test course created from JUnit"
                      code: "TEST-001"
                      learningMode: LMS
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
                      learningMode
                      lifecycleState
                      createdAt
                      updatedAt
                    }
                  }
                }
                """;

        // When - Execute the mutation
        CreateCourseTemplateResponse createResponse = graphQlClient
                .document(mutation)
                .retrieve("createCourseTemplate")
                .toEntity(CreateCourseTemplateResponse.class)
                .block();

        // Then - Verify creation was successful
        assertThat(createResponse).isNotNull();
        assertThat(createResponse.getErrors()).isEmpty();
        
        CourseTemplate createdCourse = createResponse.getCourseTemplate();
        assertThat(createdCourse).isNotNull();
        assertThat(createdCourse.getId()).isNotBlank();
        assertThat(createdCourse.getName()).isEqualTo("Test Course");
        assertThat(createdCourse.getDescription()).isEqualTo("A test course created from JUnit");
        assertThat(createdCourse.getCode()).isEqualTo("TEST-001");
        assertThat(createdCourse.getLearningMode()).isEqualTo("LMS");
        assertThat(createdCourse.getLifecycleState()).isEqualTo("ACTIVE");

        // Verify the course template exists by querying it
        String courseTemplateId = createdCourse.getId();
        String query = String.format("""
                query {
                  courseTemplate(id: "%s") {
                    id
                    name
                    description
                    code
                    learningMode
                    lifecycleState
                  }
                }
                """, courseTemplateId);

        // When - Query the created course template
        CourseTemplate queriedCourse = graphQlClient
                .document(query)
                .retrieve("courseTemplate")
                .toEntity(CourseTemplate.class)
                .block();

        // Then - Verify the course template exists and matches
        assertThat(queriedCourse).isNotNull();
        assertThat(queriedCourse.getId()).isEqualTo(courseTemplateId);
        assertThat(queriedCourse.getName()).isEqualTo("Test Course");
        assertThat(queriedCourse.getDescription()).isEqualTo("A test course created from JUnit");
        assertThat(queriedCourse.getCode()).isEqualTo("TEST-001");
        assertThat(queriedCourse.getLearningMode()).isEqualTo("LMS");
        assertThat(queriedCourse.getLifecycleState()).isEqualTo("ACTIVE");
    }
}


