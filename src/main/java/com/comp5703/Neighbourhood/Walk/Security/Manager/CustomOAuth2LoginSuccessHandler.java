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
public class CustomOAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private UsersService usersService;
    private RoleService roleService;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public CustomOAuth2LoginSuccessHandler(UsersService usersService, RoleService roleService, OAuth2AuthorizedClientService authorizedClientService) {
        this.usersService = usersService;
        this.roleService = roleService;
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // 获取当前登录的用户邮箱（通过 OAuth 登录）
        Map<String, Object> attributes = ((OAuth2AuthenticationToken) authentication).getPrincipal().getAttributes();
        String email = (String) attributes.get("email");  // OAuth 登录的用户邮箱
        Optional<Users> userOptional = usersService.getUsersByEmail(email);

        Users user;
        if (userOptional.isPresent()) {
            user = userOptional.get();  // 用户已存在
        } else {
            // 如果用户不存在，则创建新用户
            user = new Users();
            user.setEmail(email);

            // 从 authentication 中获取其他用户信息，比如姓名
            user.setName((String) attributes.get("given_name"));
            user.setSurname((String) attributes.get("family_name"));
            user.setProfileCompleted(false);
            user.setActivityStatus("Active");
            user.setPassword("oauthTempPassWord");
            user.setAddress("oauthDefaultAddress");
            user.setPhone("oauthDefaultPhoneNum");
            user.setProfImgUrl("/profileImages/profileImg_men_1.png");

            // 保存新用户到数据库
            user = usersService.saveUsers(user);
        }

        // 获取 OAuth2 token
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                authToken.getAuthorizedClientRegistrationId(),
                authToken.getName()
        );

        OAuth2AccessToken accessToken = client.getAccessToken();
        String token = accessToken.getTokenValue();  // 这里获取到 OAuth2 token

        // 检查用户的 profile 是否完成
        if (!user.isProfileCompleted()) {
            // 通过 URL 参数传递 userId, name 和 surname
            String redirectUrl = String.format(
                    "http://localhost:3000/registration-signup-oauth?userId=%d&name=%s&surname=%s",
                    user.getId(),
                    user.getName(),
                    user.getSurname()
            );
            response.sendRedirect(redirectUrl);
        } else {
            // 提取所有角色
            List<RoleDTO> roles = roleService.getRolesByUserId(user.getId());
            List<String> roleTypes = roles.stream().map(RoleDTO::getRoleType).collect(Collectors.toList());

            String status = user.getActivityStatus();

            // 检查用户状态是否为 "Blocked"
            if ("Blocked".equals(status)) {
                // 如果用户状态为 Blocked，返回 403 禁止访问
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
                return;  // 阻止进一步的处理
            }

            // 生成 JWT token
            String jwtToken = JWT.create()
                    .withSubject(user.getName())
                    .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.TOKEN_EXPIRATION))
                    .withClaim("roles", roleTypes)  // 将角色添加到 JWT token 中
                    .sign(Algorithm.HMAC512(SecurityConstants.SECRET_KEY));

            // **这里放置重定向到 oauth-redirect 页面**
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

