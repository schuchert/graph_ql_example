package com.administrate.graphql;

import com.fsi.tm2poc.graphql.client.CourseTemplate;
import com.fsi.tm2poc.graphql.client.CourseTemplateConnection;
import com.fsi.tm2poc.graphql.client.CourseTemplateEdge;
import com.fsi.tm2poc.graphql.client.Query;
import com.fsi.tm2poc.graphql.client.util.QueryExecutor;
import com.graphql_java_generator.exception.GraphQLRequestExecutionException;
import com.graphql_java_generator.exception.GraphQLRequestPreparationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ComponentScan(basePackages = {"com.administrate.graphql", "com.graphql_java_generator"})
class CourseTemplateQueryTest {

    @Autowired
    private QueryExecutor queryExecutor;

    @Test
    void testGetAllCourseTemplates() 
            throws GraphQLRequestExecutionException, GraphQLRequestPreparationException {
        
        // Define the GraphQL query
        // Note: The query string omits the "query" keyword and starts with "{"
        String query = "{ courseTemplates { edges { node { id name description code title learningMode lifecycleState createdAt updatedAt } } pageInfo { hasNextPage hasPreviousPage } } }";
        
        // Execute the query (no parameters needed for this simple query)
        Query response = queryExecutor.execWithBindValues(query, new HashMap<>());
        
        // Assert that the response is not null
        assertNotNull(response);
        assertNotNull(response.getCourseTemplates());
        
        // Extract the course templates from the response
        CourseTemplateConnection connection = response.getCourseTemplates();
        assertNotNull(connection);
        
        List<CourseTemplate> templates = connection.getEdges() != null
                ? connection.getEdges().stream()
                        .map(CourseTemplateEdge::getNode)
                        .collect(Collectors.toList())
                : List.of();
        
        // Assert that we got results (or empty list if none exist)
        assertNotNull(templates);
        
        // Print results for debugging
        System.out.println("Found " + templates.size() + " course templates");
        templates.forEach(template -> 
            System.out.println("Template: " + template.getName() + " (ID: " + template.getId() + ")")
        );
    }

    @Test
    void testGetCourseTemplatesWithPagination() 
            throws GraphQLRequestExecutionException, GraphQLRequestPreparationException {
        
        // Define the GraphQL query with parameters
        String query = "{ courseTemplates(first: ?first, offset: ?offset) { edges { node { id name description code title learningMode lifecycleState } } pageInfo { hasNextPage hasPreviousPage startCursor endCursor } } }";
        
        // Set up parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("first", 10);
        parameters.put("offset", 0);
        
        // Execute the query
        Query response = queryExecutor.execWithBindValues(query, parameters);
        
        // Assert response
        assertNotNull(response);
        assertNotNull(response.getCourseTemplates());
        
        // Extract results
        CourseTemplateConnection connection = response.getCourseTemplates();
        assertNotNull(connection);
        assertNotNull(connection.getPageInfo());
        
        List<CourseTemplate> templates = connection.getEdges() != null
                ? connection.getEdges().stream()
                        .map(CourseTemplateEdge::getNode)
                        .collect(Collectors.toList())
                : List.of();
        
        // Assert pagination info
        assertNotNull(connection.getPageInfo());
        assertNotNull(connection.getPageInfo().getHasNextPage());
        assertNotNull(connection.getPageInfo().getHasPreviousPage());
        
        // Assert we got at most 10 results
        assertTrue(templates.size() <= 10, "Should return at most 10 results");
        
        System.out.println("Retrieved " + templates.size() + " course templates with pagination");
    }
}