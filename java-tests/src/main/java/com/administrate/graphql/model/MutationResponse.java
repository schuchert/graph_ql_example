package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

/**
 * Generic mutation response wrapper.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MutationResponse<T> {
    private List<Error> errors;
    private T data;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Error {
        private String field;
        private String message;
    }
}

