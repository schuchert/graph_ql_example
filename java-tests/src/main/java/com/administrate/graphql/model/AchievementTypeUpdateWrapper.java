package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Wrapper for the nested achievementType.update response structure.
 * Matches the generated Kotlin structure: Result.achievementType.update
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AchievementTypeUpdateWrapper {
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
         * Updates an Achievement Type
         */
        private UpdateAchievementTypeResponse update;

        public UpdateAchievementTypeResponse getUpdate() {
            return update;
        }

        public void setUpdate(UpdateAchievementTypeResponse update) {
            this.update = update;
        }
    }
}

