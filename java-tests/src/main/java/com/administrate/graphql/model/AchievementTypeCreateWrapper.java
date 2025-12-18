package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AchievementTypeCreateWrapper {
    private CreateAchievementTypeResponse create;

    public CreateAchievementTypeResponse getCreate() {
        return create;
    }

    public void setCreate(CreateAchievementTypeResponse create) {
        this.create = create;
    }
}

