package com.administrate.graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AchievementTypeConnection {
    private List<AchievementTypeEdge> edges;
    private PageInfo pageInfo;

    public List<AchievementTypeEdge> getEdges() { return edges; }
    public void setEdges(List<AchievementTypeEdge> edges) { this.edges = edges; }

    public PageInfo getPageInfo() { return pageInfo; }
    public void setPageInfo(PageInfo pageInfo) { this.pageInfo = pageInfo; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AchievementTypeEdge {
        private String cursor;
        private AchievementType node;

        public String getCursor() { return cursor; }
        public void setCursor(String cursor) { this.cursor = cursor; }

        public AchievementType getNode() { return node; }
        public void setNode(AchievementType node) { this.node = node; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PageInfo {
        private Boolean hasNextPage;
        private Boolean hasPreviousPage;
        private String startCursor;
        private String endCursor;

        public Boolean getHasNextPage() { return hasNextPage; }
        public void setHasNextPage(Boolean hasNextPage) { this.hasNextPage = hasNextPage; }

        public Boolean getHasPreviousPage() { return hasPreviousPage; }
        public void setHasPreviousPage(Boolean hasPreviousPage) { this.hasPreviousPage = hasPreviousPage; }

        public String getStartCursor() { return startCursor; }
        public void setStartCursor(String startCursor) { this.startCursor = startCursor; }

        public String getEndCursor() { return endCursor; }
        public void setEndCursor(String endCursor) { this.endCursor = endCursor; }
    }
}

