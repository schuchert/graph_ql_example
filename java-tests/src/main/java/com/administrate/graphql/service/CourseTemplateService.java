package com.administrate.graphql.service;

import com.administrate.graphql.model.CourseTemplate;
import com.administrate.graphql.model.MutationResponse;
import org.springframework.graphql.client.HttpGraphQlClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Service for CourseTemplate operations using Spring GraphQL.
 */
@Service
public class CourseTemplateService {

    private final HttpGraphQlClient graphQlClient;

    public CourseTemplateService(HttpGraphQlClient graphQlClient) {
        this.graphQlClient = graphQlClient;
    }

    /**
     * Query all course templates.
     */
    public Mono<CourseTemplate[]> findAll() {
        String query = """
                query {
                  courseTemplates {
                    edges {
                      node {
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
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      startCursor
                      endCursor
                    }
                  }
                }
                """;

        return graphQlClient.document(query)
                .retrieve("courseTemplates.edges[*].node")
                .toEntityList(CourseTemplate.class)
                .map(list -> list.toArray(new CourseTemplate[0]));
    }

    /**
     * Query a course template by ID.
     */
    public Mono<CourseTemplate> findById(String id) {
        String query = """
                query($id: ID!) {
                  courseTemplate(id: $id) {
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
                    lmsContents {
                      edges {
                        node {
                          ... on LmsResourceType {
                            id
                            title
                            description
                            resourceUrl
                            order
                            autoComplete
                          }
                          ... on LmsExternalType {
                            id
                            title
                            description
                            externalUrl
                            order
                          }
                          ... on LmsSeparatorType {
                            id
                            title
                            order
                          }
                        }
                      }
                    }
                    achievementTypes {
                      edges {
                        node {
                          id
                          achievementType {
                            id
                            name
                            description
                            points
                            badgeUrl
                          }
                          autoAward
                        }
                      }
                    }
                  }
                }
                """;

        return graphQlClient.document(query)
                .variable("id", id)
                .retrieve("courseTemplate")
                .toEntity(CourseTemplate.class);
    }

    /**
     * Create a new course template.
     */
    public Mono<MutationResponse<CourseTemplate>> create(String name, String description, 
                                                          String code, String learningMode) {
        String mutation = """
                mutation($input: CreateCourseTemplateInput!) {
                  createCourseTemplate(input: $input) {
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
                """;

        var inputBuilder = new java.util.HashMap<String, Object>();
        inputBuilder.put("name", name);
        if (description != null) inputBuilder.put("description", description);
        if (code != null) inputBuilder.put("code", code);
        inputBuilder.put("learningMode", learningMode != null ? learningMode : "LMS");

        return graphQlClient.document(mutation)
                .variable("input", inputBuilder)
                .retrieve("createCourseTemplate")
                .toEntity(CreateCourseTemplateResponse.class)
                .map(response -> {
                    var mutationResponse = new MutationResponse<CourseTemplate>();
                    mutationResponse.setErrors(response.getErrors());
                    mutationResponse.setData(response.getCourseTemplate());
                    return mutationResponse;
                });
    }
    
    // Helper class for mutation response
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class CreateCourseTemplateResponse {
        private java.util.List<MutationResponse.Error> errors;
        private CourseTemplate courseTemplate;
    }

    /**
     * Update a course template.
     */
    public Mono<MutationResponse<CourseTemplate>> update(String id, String name, 
                                                          String description, String code) {
        String mutation = """
                mutation($input: UpdateCourseTemplateInput!) {
                  updateCourseTemplate(input: $input) {
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
                """;

        var inputBuilder = new java.util.HashMap<String, Object>();
        inputBuilder.put("id", id);
        if (name != null) inputBuilder.put("name", name);
        if (description != null) inputBuilder.put("description", description);
        if (code != null) inputBuilder.put("code", code);

        return graphQlClient.document(mutation)
                .variable("input", inputBuilder)
                .retrieve("updateCourseTemplate")
                .toEntity(UpdateCourseTemplateResponse.class)
                .map(response -> {
                    var mutationResponse = new MutationResponse<CourseTemplate>();
                    mutationResponse.setErrors(response.getErrors());
                    mutationResponse.setData(response.getCourseTemplate());
                    return mutationResponse;
                });
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class UpdateCourseTemplateResponse {
        private java.util.List<MutationResponse.Error> errors;
        private CourseTemplate courseTemplate;
    }

    /**
     * Delete a course template.
     */
    public Mono<Boolean> delete(String id) {
        String mutation = """
                mutation($id: ID!) {
                  deleteCourseTemplate(id: $id)
                }
                """;

        return graphQlClient.document(mutation)
                .variable("id", id)
                .retrieve("deleteCourseTemplate")
                .toEntity(Boolean.class);
    }
}

