package com.comp5703.Neighbourhood.Walk.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // set global CORS rule
        registry.addMapping("/**")  // match all routes
                .allowedOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004")
                .allowedMethods("*")  // allowed HTTP method
                .allowedHeaders("*")  // allow all request headers
                .allowCredentials(true);  // allow to carry credential info（like cookies）
    }
}
