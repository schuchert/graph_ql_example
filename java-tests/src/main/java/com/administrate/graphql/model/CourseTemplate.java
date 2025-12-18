package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseTemplate {
    private String id;
    private String name; // Deprecated, but kept for backward compatibility
    private String title;
    private String description;
    private String code;
    private String learningMode;
    private String eventLearningMode;
    private String lifecycleState;
    private Instant createdAt;
    private Instant updatedAt;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name != null ? name : title; }
    public void setName(String name) { this.name = name; }
    
    public String getTitle() { return title != null ? title : name; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getLearningMode() { return learningMode; }
    public void setLearningMode(String learningMode) { this.learningMode = learningMode; }
    
    public String getEventLearningMode() { return eventLearningMode; }
    public void setEventLearningMode(String eventLearningMode) { this.eventLearningMode = eventLearningMode; }
    
    public String getLifecycleState() { return lifecycleState; }
    public void setLifecycleState(String lifecycleState) { this.lifecycleState = lifecycleState; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}


