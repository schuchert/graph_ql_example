package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseTemplateUpdateWrapper {
    private UpdateCourseTemplateResponse update;

    public UpdateCourseTemplateResponse getUpdate() {
        return update;
    }

    public void setUpdate(UpdateCourseTemplateResponse update) {
        this.update = update;
    }
}

