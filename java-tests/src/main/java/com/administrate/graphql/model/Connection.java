package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

/**
 * GraphQL Connection type for pagination.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Connection<T> {
    private List<Edge<T>> edges;
    private PageInfo pageInfo;
}

/**
 * Edge in a connection.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
class Edge<T> {
    private T node;
    private String cursor;
}

/**
 * PageInfo for pagination.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
class PageInfo {
    private Boolean hasNextPage;
    private Boolean hasPreviousPage;
    private String startCursor;
    private String endCursor;
}

