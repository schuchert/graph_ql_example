package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.Instant;
import java.util.List;

/**
 * CourseTemplate entity model.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseTemplate {
    private String id;
    private String legacyId;
    private String name;
    private String description;
    private String code;
    private String title;
    private String learningMode;
    private String lifecycleState;
    private Instant createdAt;
    private Instant updatedAt;
    private Connection<LmsContent> lmsContents;
    private Connection<CourseTemplateAchievementType> achievementTypes;
}

