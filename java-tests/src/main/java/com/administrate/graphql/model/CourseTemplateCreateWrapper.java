package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Wrapper for the nested courseTemplate.create response structure.
 * Matches the generated Kotlin structure: Result.courseTemplate.create
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseTemplateCreateWrapper {
    /**
     * Mutations for Course Templates
     */
    private CourseTemplateMutations courseTemplate;

    public CourseTemplateMutations getCourseTemplate() {
        return courseTemplate;
    }

    public void setCourseTemplate(CourseTemplateMutations courseTemplate) {
        this.courseTemplate = courseTemplate;
    }

    /**
     * Available Mutations on a CourseTemplate
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CourseTemplateMutations {
        /**
         * Creates a new Course Template
         */
        private CreateCourseTemplateResponse create;

        public CreateCourseTemplateResponse getCreate() {
            return create;
        }

        public void setCreate(CreateCourseTemplateResponse create) {
            this.create = create;
        }
    }
}

