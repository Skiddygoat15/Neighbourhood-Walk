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
        // 通过 email 获取用户
        Optional<Users> userOptional = usersService.getUsersByEmail(authentication.getName());

        // 检查用户是否存在
        if (userOptional.isEmpty()) {
            throw new BadCredentialsException("User not found with email: " + authentication.getName());
        }

        Users user = userOptional.get();

        if (!bCryptPasswordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
            throw new BadCredentialsException("You Provided a Wrong Password!");
        }
        return new UsernamePasswordAuthenticationToken(authentication.getName(), user.getPassword());
    }
}
