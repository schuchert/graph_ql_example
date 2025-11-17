package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.Instant;

/**
 * AchievementType entity model.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AchievementType {
    private String id;
    private String legacyId;
    private String name;
    private String description;
    private Integer points;
    private String badgeUrl;
    private String certificateTypeId;
    private Instant createdAt;
    private Instant updatedAt;
}

