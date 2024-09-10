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
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // allowed HTTP method
                .allowedHeaders("*")  // allow all request headers
                .allowCredentials(true);  // allow to carry credential info（like cookies）
    }
}
