package com.comp5703.Neighbourhood.Walk.Security.Manager;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Security.SecurityConstants;
import com.comp5703.Neighbourhood.Walk.Service.RoleService;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class CustomOAuth2LoginSuccessHandlerDev implements AuthenticationSuccessHandler {

    private UsersService usersService;
    private RoleService roleService;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public CustomOAuth2LoginSuccessHandlerDev(UsersService usersService, RoleService roleService, OAuth2AuthorizedClientService authorizedClientService) {
        this.usersService = usersService;
        this.roleService = roleService;
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // Get the currently logged in user's email (via OAuth login)
        Map<String, Object> attributes = ((OAuth2AuthenticationToken) authentication).getPrincipal().getAttributes();
        String email = (String) attributes.get("email");  // User Email for OAuth Login
        Optional<Users> userOptional = usersService.getUsersByEmail(email);

        Users user;
        if (userOptional.isPresent()) {
            user = userOptional.get();  // User already exists
        } else {
            // If the user does not exist, create a new user
            user = new Users();
            user.setEmail(email);

            // Get other user information, such as name, from authentication
            user.setName((String) attributes.get("given_name"));
            user.setSurname((String) attributes.get("family_name"));
            user.setProfileCompleted(false);
            user.setPassword("oauthTempPassWord");
            user.setAddress("oauthDefaultAddress");
            user.setPhone("oauthDefaultPhoneNum");
            user.setProfImgUrl("/profileImages/profileImg_men_1.png");

            // Saving new users to the database
            user = usersService.saveUsers(user);
        }

        // Get OAuth2 token
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                authToken.getAuthorizedClientRegistrationId(),
                authToken.getName()
        );

        OAuth2AccessToken accessToken = client.getAccessToken();
        String token = accessToken.getTokenValue();  // Get the OAuth2 token here

        // Check if the user's profile is complete
        if (!user.isProfileCompleted()) {
            // Pass the userId, name and surname as URL parameters.
            String redirectUrl = String.format(
                    "http://localhost:3000/registration-signup-oauth?userId=%d&name=%s&surname=%s",
                    user.getId(),
                    user.getName(),
                    user.getSurname()
            );
            response.sendRedirect(redirectUrl);
        } else {
            // Extract all roles
            List<RoleDTO> roles = roleService.getRolesByUserId(user.getId());
            List<String> roleTypes = roles.stream().map(RoleDTO::getRoleType).collect(Collectors.toList());

            String status = user.getActivityStatus();

            // Check if the user status is "Blocked"
            if ("Blocked".equals(status)) {
                // If the user status is Blocked, return 403 Disable Access
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                String errorResponse = String.format(
                        "{\"error\": \"User account is blocked\", \"userId\":\"%d\", \"name\":\"%s\", \"status\":\"%s\"}",
                        user.getId(),
                        user.getName(),
                        status
                );
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write(errorResponse);
                return;  // Preventing further processing
            }

            // Generate JWT token
            String jwtToken = JWT.create()
                    .withSubject(user.getName())
                    .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.TOKEN_EXPIRATION))
                    .withClaim("roles", roleTypes)  // Adding roles to a JWT token
                    .sign(Algorithm.HMAC512(SecurityConstants.SECRET_KEY));

            // **This places a redirect to the oauth-redirect page**
            String redirectUrl = String.format(
                    "http://localhost:3000/oauth-redirect?userId=%d&name=%s&preferredName=%s&roles=%s&token=%s",
                    user.getId(),
                    user.getName(),
                    user.getPreferredName(),
                    String.join(",", roleTypes),
                    jwtToken
            );
            response.sendRedirect(redirectUrl);
        }
    }

}

