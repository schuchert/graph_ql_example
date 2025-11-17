package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;

import java.time.Instant;

/**
 * Base class for LMS Content types (union type).
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "__typename")
@JsonSubTypes({
    @JsonSubTypes.Type(value = LmsResourceType.class, name = "LmsResourceType"),
    @JsonSubTypes.Type(value = LmsExternalType.class, name = "LmsExternalType"),
    @JsonSubTypes.Type(value = LmsSeparatorType.class, name = "LmsSeparatorType")
})
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class LmsContent {
    private String id;
    private String legacyId;
    private String title;
    private Integer order;
    private Instant createdAt;
}

/**
 * LMS Resource Type.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
class LmsResourceType extends LmsContent {
    private String description;
    private String resourceUrl;
    private Boolean autoComplete;
    private String displayName;
    private String documentId;
}

/**
 * LMS External Type.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
class LmsExternalType extends LmsContent {
    private String description;
    private String externalUrl;
    private Boolean autoComplete;
    private String displayName;
}

/**
 * LMS Separator Type.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
class LmsSeparatorType extends LmsContent {
}

