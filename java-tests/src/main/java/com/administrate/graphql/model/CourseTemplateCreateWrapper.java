package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseTemplateCreateWrapper {
    private CreateCourseTemplateResponse create;

    public CreateCourseTemplateResponse getCreate() {
        return create;
    }

    public void setCreate(CreateCourseTemplateResponse create) {
        this.create = create;
    }
}

