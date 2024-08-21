package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Users;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface UsersService {
    Users saveUsers(Users user);
    Optional<Users> getUsersByEmail(String email);
    void deleteUsers(int id);
    List<Users> getAllUsers();
}
