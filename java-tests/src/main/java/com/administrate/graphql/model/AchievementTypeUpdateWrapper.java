package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AchievementTypeUpdateWrapper {
    private UpdateAchievementTypeResponse update;

    public UpdateAchievementTypeResponse getUpdate() {
        return update;
    }

    public void setUpdate(UpdateAchievementTypeResponse update) {
        this.update = update;
    }
}

