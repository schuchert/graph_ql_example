package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Wrapper for the nested courseTemplate.update response structure.
 * Matches the generated Kotlin structure: Result.courseTemplate.update
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseTemplateUpdateWrapper {
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
         * Updates an existing Course Template
         */
        private UpdateCourseTemplateResponse update;

        public UpdateCourseTemplateResponse getUpdate() {
            return update;
        }

        public void setUpdate(UpdateCourseTemplateResponse update) {
            this.update = update;
        }
    }
}

