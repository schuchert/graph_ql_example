package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Wrapper for the nested achievementType.create response structure.
 * Matches the generated Kotlin structure: Result.achievementType.create
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AchievementTypeCreateWrapper {
    /**
     * Mutations for Achievement Type
     */
    private AchievementTypeMutations achievementType;

    public AchievementTypeMutations getAchievementType() {
        return achievementType;
    }

    public void setAchievementType(AchievementTypeMutations achievementType) {
        this.achievementType = achievementType;
    }

    /**
     * Available Mutations on an AchievementType
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AchievementTypeMutations {
        /**
         * Creates an Achievement Type
         */
        private CreateAchievementTypeResponse create;

        public CreateAchievementTypeResponse getCreate() {
            return create;
        }

        public void setCreate(CreateAchievementTypeResponse create) {
            this.create = create;
        }
    }
}

