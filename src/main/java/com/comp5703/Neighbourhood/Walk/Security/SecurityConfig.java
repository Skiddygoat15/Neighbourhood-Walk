package com.comp5703.Neighbourhood.Walk.Security;

import com.comp5703.Neighbourhood.Walk.Security.Filter.AuthenticationFilter;
import com.comp5703.Neighbourhood.Walk.Security.Filter.ExceptionHandlerFilter;
import com.comp5703.Neighbourhood.Walk.Security.Filter.JWTAuthorizationFilter;
import com.comp5703.Neighbourhood.Walk.Security.Manager.CustomAuthenticationManager;
import com.comp5703.Neighbourhood.Walk.Security.Manager.CustomOAuth2LoginSuccessHandler;
import com.comp5703.Neighbourhood.Walk.Service.RoleService;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;


@Configuration
@AllArgsConstructor
public class SecurityConfig {

    private BCryptPasswordEncoder passwordEncoder;

    CustomAuthenticationManager customAuthenticationManager;
    UsersService usersService;
    RoleService roleService;
    private final CustomOAuth2LoginSuccessHandler customOAuth2LoginSuccessHandler; // pour into CustomOAuth2LoginSuccessHandler

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        AuthenticationFilter authenticationFilter = new AuthenticationFilter(customAuthenticationManager, usersService, roleService);
        authenticationFilter.setFilterProcessesUrl("/login");

        http
                .headers().frameOptions().disable()// Delete this when migrate to MySQL
                .and()// Delete this when migrate to MySQL
                .csrf().disable()
                .authorizeHttpRequests() // Change from authorizeRequests to authorizeHttpRequests
                .requestMatchers("/h2/**").permitAll() // Change from antMatchers to requestMatchers
                .requestMatchers(HttpMethod.POST, SecurityConstants.REGISTER_PATH).permitAll()
                .requestMatchers("/geocode/**").permitAll()
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/Users/registerOA/**").permitAll()
                // Allow access to Google OAuth login page
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/Users/blockUser/**").hasAuthority("admin")
                .requestMatchers("/Users/activeUser/**").hasAuthority("admin")
                .requestMatchers("/requests/stats").hasAuthority("admin")
                .requestMatchers("/Users/stats").hasAuthority("admin")
                .anyRequest().authenticated()
                .and()
                .oauth2Login() // Enable OAuth2 login
                    .successHandler(customOAuth2LoginSuccessHandler) // Using custom success handlers
                    .failureUrl("http://localhost:3000/registration-loginform") // Login Failure Redirection
                .and()
                .addFilterBefore(new ExceptionHandlerFilter(), AuthenticationFilter.class)
                .addFilter(authenticationFilter)
                .addFilterAfter(new JWTAuthorizationFilter(), AuthenticationFilter.class)
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        return http.build();
    }
}
