package com.comp5703.Neighbourhood.Walk.Security.Manager;

import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import com.comp5703.Neighbourhood.Walk.Service.UsersServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@AllArgsConstructor
public class CustomAuthenticationManager implements AuthenticationManager {
    private UsersService usersService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String loginInput = authentication.getName();
        Optional<Users> userOptional;

        // 判断输入是否为 email 格式
        if (loginInput.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            // 如果是 email 格式
            userOptional = usersService.getUsersByEmail(loginInput);
        } else {
            // 否则按照 phone 查询
            userOptional = usersService.getUsersByPhone(loginInput);
        }

        // 检查用户是否存在
        if (userOptional.isEmpty()) {
            throw new BadCredentialsException("User not found with input: " + loginInput);
        }

        Users user = userOptional.get();

        // 验证密码
        if (!bCryptPasswordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
            throw new BadCredentialsException("You Provided a Wrong Password!");
        }

        return new UsernamePasswordAuthenticationToken(loginInput, user.getPassword());
    }
}
