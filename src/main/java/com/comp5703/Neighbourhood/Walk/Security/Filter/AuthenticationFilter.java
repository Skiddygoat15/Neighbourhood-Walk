package com.comp5703.Neighbourhood.Walk.Security.Filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Security.Manager.CustomAuthenticationManager;
import com.comp5703.Neighbourhood.Walk.Security.SecurityConstants;
import com.comp5703.Neighbourhood.Walk.Service.RoleService;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private CustomAuthenticationManager authenticationManager;
    private UsersService usersService;
    private RoleService roleService;


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        try {
            Users user = new ObjectMapper().readValue(request.getInputStream(), Users.class);

            Authentication authentication;
            if (user.getEmail() != null && user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
                // If email is not empty and matches the email format, use email for authentication.
                authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
            } else if (user.getPhone() != null && user.getPhone().matches("^\\d{1,11}$")) {
                // If not email, use phone for authentication, assuming that the phone number is 1-11 digits.
                authentication = new UsernamePasswordAuthenticationToken(user.getPhone(), user.getPassword());
            } else {
                throw new RuntimeException("Invalid login credentials");
            }

            return authenticationManager.authenticate(authentication);
        } catch (IOException e) {
            throw new RuntimeException();
        }

    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(failed.getMessage());
        response.getWriter().flush();
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        String loginInput = authResult.getName(); // email or phone

        // Call the getUserByEmailOrPhone method of UsersService.
        Optional<Users> userOptional = usersService.getUserByEmailOrPhone(loginInput);

        // Ensure user presence
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        Users user = userOptional.get();

        // Check the user's ActivityStatus
        String activityStatus = usersService.getUserStatusById(user.getId());

        // Deny login if user is blocked
        if ("Blocked".equals(activityStatus)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"User account is blocked.\"}");
            response.getWriter().flush();
            return; // Blocking continuation
        }
        long userId = user.getId();
        List<String> roleTypes = new ArrayList<>();
        // Get user roles
        List<RoleDTO> roles = roleService.getRolesByUserId(userId); // For example, return ["user", "admin"].
        for (RoleDTO role : roles) {
            String roleType = role.getRoleType();
            roleTypes.add(roleType);
        }

        for (String roleType : roleTypes) {
            System.out.println(roleType);
        }


        String token = JWT.create()
                .withSubject(authResult.getName())
                .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.TOKEN_EXPIRATION))
                .withClaim("roles", roleTypes) // Add roles to token
                .sign(Algorithm.HMAC512(SecurityConstants.SECRET_KEY));

        // Put the token in the response body
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"token\": \"" + token + "\", \"userId\": " + userId + "}");

        // If you still want to return the token in the header
        response.addHeader(SecurityConstants.AUTHORIZATION, SecurityConstants.BEARER + token);
    }
}
