package com.administrate.graphql.service;

import com.administrate.graphql.model.AchievementType;
import com.administrate.graphql.model.MutationResponse;
import org.springframework.graphql.client.HttpGraphQlClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Service for AchievementType operations using Spring GraphQL.
 */
@Service
public class AchievementTypeService {

    private final HttpGraphQlClient graphQlClient;

    public AchievementTypeService(HttpGraphQlClient graphQlClient) {
        this.graphQlClient = graphQlClient;
    }

    /**
     * Query all achievement types.
     */
    public Mono<AchievementType[]> findAll() {
        String query = """
                query {
                  achievementTypes {
                    edges {
                      node {
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
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                    }
                  }
                }
                """;

        return graphQlClient.document(query)
                .retrieve("achievementTypes.edges[*].node")
                .toEntityList(AchievementType.class)
                .map(list -> list.toArray(new AchievementType[0]));
    }

    /**
     * Query an achievement type by ID.
     */
    public Mono<AchievementType> findById(String id) {
        String query = """
                query($id: ID!) {
                  achievementType(id: $id) {
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
                """;

        return graphQlClient.document(query)
                .variable("id", id)
                .retrieve("achievementType")
                .toEntity(AchievementType.class);
    }

    /**
     * Create a new achievement type.
     */
    public Mono<MutationResponse<AchievementType>> create(String name, String description, 
                                                          Integer points, String badgeUrl) {
        String mutation = """
                mutation($input: CreateAchievementTypeInput!) {
                  createAchievementType(input: $input) {
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
                """;

        var inputBuilder = new java.util.HashMap<String, Object>();
        inputBuilder.put("name", name);
        if (description != null) inputBuilder.put("description", description);
        if (points != null) inputBuilder.put("points", points);
        if (badgeUrl != null) inputBuilder.put("badgeUrl", badgeUrl);

        return graphQlClient.document(mutation)
                .variable("input", inputBuilder)
                .retrieve("createAchievementType")
                .toEntity(CreateAchievementTypeResponse.class)
                .map(response -> {
                    var mutationResponse = new MutationResponse<AchievementType>();
                    mutationResponse.setErrors(response.getErrors());
                    mutationResponse.setData(response.getAchievementType());
                    return mutationResponse;
                });
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class CreateAchievementTypeResponse {
        private java.util.List<MutationResponse.Error> errors;
        private AchievementType achievementType;
    }

    /**
     * Update an achievement type.
     */
    public Mono<MutationResponse<AchievementType>> update(String id, String name, 
                                                         String description, Integer points, 
                                                         String badgeUrl) {
        String mutation = """
                mutation($input: UpdateAchievementTypeInput!) {
                  updateAchievementType(input: $input) {
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
                """;

        var inputBuilder = new java.util.HashMap<String, Object>();
        inputBuilder.put("id", id);
        if (name != null) inputBuilder.put("name", name);
        if (description != null) inputBuilder.put("description", description);
        if (points != null) inputBuilder.put("points", points);
        if (badgeUrl != null) inputBuilder.put("badgeUrl", badgeUrl);

        return graphQlClient.document(mutation)
                .variable("input", inputBuilder)
                .retrieve("updateAchievementType")
                .toEntity(UpdateAchievementTypeResponse.class)
                .map(response -> {
                    var mutationResponse = new MutationResponse<AchievementType>();
                    mutationResponse.setErrors(response.getErrors());
                    mutationResponse.setData(response.getAchievementType());
                    return mutationResponse;
                });
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class UpdateAchievementTypeResponse {
        private java.util.List<MutationResponse.Error> errors;
        private AchievementType achievementType;
    }

    /**
     * Delete an achievement type.
     */
    public Mono<Boolean> delete(String id) {
        String mutation = """
                mutation($id: ID!) {
                  deleteAchievementType(id: $id)
                }
                """;

        return graphQlClient.document(mutation)
                .variable("id", id)
                .retrieve("deleteAchievementType")
                .toEntity(Boolean.class);
    }
}

