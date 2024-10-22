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
                // 如果 email 非空且符合 email 格式，使用 email 进行认证
                authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
            } else if (user.getPhone() != null && user.getPhone().matches("^\\d{1,11}$")) {
                // 如果不是 email，使用 phone 进行认证，假设电话号码是1-11位数字
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
        String loginInput = authResult.getName(); // email 或 phone

        // 调用 UsersService 的 getUserByEmailOrPhone 方法
        Optional<Users> userOptional = usersService.getUserByEmailOrPhone(loginInput);

        // 确保用户存在
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        Users user = userOptional.get();

        // 检查用户的 ActivityStatus
        String activityStatus = usersService.getUserStatusById(user.getId());

        // 如果用户被 block，则拒绝登录
        if ("Blocked".equals(activityStatus)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"User account is blocked.\"}");
            response.getWriter().flush();
            return; // 阻止继续执行
        }
        long userId = user.getId();
        List<String> roleTypes = new ArrayList<>();
        // 获取用户角色
        List<RoleDTO> roles = roleService.getRolesByUserId(userId); // 例如返回 ["user", "admin"]
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
                .withClaim("roles", roleTypes) // 将角色添加到token中
                .sign(Algorithm.HMAC512(SecurityConstants.SECRET_KEY));

        // 将 token 放入响应体
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"token\": \"" + token + "\", \"userId\": " + userId + "}");

        // 如果仍希望在 header 中返回 token
        response.addHeader(SecurityConstants.AUTHORIZATION, SecurityConstants.BEARER + token);
    }
}
