package com.administrate.graphql;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.graphql.client.HttpGraphQlClient;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Base test class for Spring Boot GraphQL tests.
 */
@SpringBootTest(classes = GraphQLApplication.class)
@TestPropertySource(properties = {
        "graphql.server.url=http://localhost:4000"
})
@SpringJUnitConfig
public abstract class BaseGraphQLTest {

    @Autowired
    protected HttpGraphQlClient graphQlClient;

    protected void waitForServer() {
        // Spring GraphQL client will handle connection errors
        // We can add a health check here if needed
    }
}
