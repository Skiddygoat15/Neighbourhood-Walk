package com.comp5703.Neighbourhood.Walk.Security.Manager;

import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.RoleService;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
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
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
        String email = authentication.getName();  // OAuth 登录的用户邮箱
        Optional<Users> userOptional = usersService.getUsersByEmail(email);

        Users user;
        if (userOptional.isPresent()) {
            user = userOptional.get();  // 用户已存在
        } else {
            // 如果用户不存在，则创建新用户
            user = new Users();
            user.setEmail(email);

            // 从 authentication 中获取其他用户信息，比如姓名
            Map<String, Object> attributes = ((OAuth2AuthenticationToken) authentication).getPrincipal().getAttributes();
            user.setName((String) attributes.get("given_name"));
            user.setSurname((String) attributes.get("family_name"));
            user.setProfileCompleted(false);
            user.setPassword("oauthTempPassWord");
            user.setAddress("oauthDefaultAddress");
            user.setPhone("oauthDefaultPhoneNum");

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
            // 如果 profile 未完成，重定向到 complete-profile 页面
            response.sendRedirect("http://localhost:3000/registration-signup-oauth");
        } else {
            // 提取所有角色
            List<RoleDTO> roles = roleService.getRolesByUserId(user.getId());
            List<String> roleTypes = roles.stream().map(RoleDTO::getRoleType).collect(Collectors.toList());

            // 构建 JSON 响应体
            String jsonResponse = String.format(
                    "{\"userId\":\"%d\", \"name\":\"%s\", \"roles\":%s, \"token\":\"%s\", \"redirectUrl\":\"%s\"}",
                    user.getId(),
                    user.getName(),
                    roleTypes.toString(),
                    token, // 返回获取到的 OAuth2 token
                    "http://localhost:3000/oauth-redirect"
            );

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(jsonResponse);
        }
    }

}

