package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Users;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface UsersService {
    Users saveUsers(Users user);
    //something
    Optional<Users> getUsersByEmail(String email);
    void deleteUsers(long id);
    List<Users> getAllUsers();

    //byron
    List<Users> searchWalkers(String search);

    Users getUserById(long id);
}
