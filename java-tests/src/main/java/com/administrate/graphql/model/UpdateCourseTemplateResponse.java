package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateCourseTemplateResponse {
    private List<Error> errors;
    private CourseTemplate courseTemplate;

    public List<Error> getErrors() { return errors; }
    public void setErrors(List<Error> errors) { this.errors = errors; }

    public CourseTemplate getCourseTemplate() { return courseTemplate; }
    public void setCourseTemplate(CourseTemplate courseTemplate) { this.courseTemplate = courseTemplate; }

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

