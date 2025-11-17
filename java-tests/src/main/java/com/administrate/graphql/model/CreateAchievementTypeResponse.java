package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateAchievementTypeResponse {
    private List<Error> errors;
    private AchievementType achievementType;

    public List<Error> getErrors() { return errors; }
    public void setErrors(List<Error> errors) { this.errors = errors; }

    public AchievementType getAchievementType() { return achievementType; }
    public void setAchievementType(AchievementType achievementType) { this.achievementType = achievementType; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Error {
        private String field;
        private String message;

        public String getField() { return field; }
        public void setField(String field) { this.field = field; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}

