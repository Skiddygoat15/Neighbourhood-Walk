package com.comp5703.Neighbourhood.Walk.Security.Manager;

import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
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

        // Determine if the input is in email format
        if (loginInput.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            // If in email format
            userOptional = usersService.getUsersByEmail(loginInput);
        } else {
            // Otherwise, search by phone
            userOptional = usersService.getUsersByPhone(loginInput);
        }

        // Check if the user exists
        if (userOptional.isEmpty()) {
            throw new BadCredentialsException("User not found with input: " + loginInput);
        }

        Users user = userOptional.get();

        // Verify Password
        if (!bCryptPasswordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
            throw new BadCredentialsException("You Provided a Wrong Password!");
        }

        return new UsernamePasswordAuthenticationToken(loginInput, user.getPassword());
    }
}
