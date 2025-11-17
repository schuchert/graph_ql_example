package com.administrate.graphql.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.client.HttpGraphQlClient;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuration for Spring GraphQL client.
 */
@Configuration
public class GraphQLConfig {

    @Value("${graphql.server.url:http://localhost:4000}")
    private String graphqlServerUrl;

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(graphqlServerUrl)
                .build();
    }

    @Bean
    public HttpGraphQlClient graphQlClient(WebClient webClient) {
        return HttpGraphQlClient.builder(webClient)
                .build();
    }
}

