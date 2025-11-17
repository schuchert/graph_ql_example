package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

/**
 * CourseTemplateAchievementType join entity.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseTemplateAchievementType {
    private String id;
    private AchievementType achievementType;
    private Boolean autoAward;
}

