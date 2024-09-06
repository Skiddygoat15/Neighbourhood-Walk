package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Users;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface UsersService {
    Users saveUsers(Users user);
    //something
    Optional<Users> getUsersByEmail(String email);
    Optional<Users> getUsersByPhone(String phone);
    void deleteUsers(long id);
    List<Users> getAllUsers();

    Users getUserById(long id);

    Users registerUser(Users user, String roleType);
    Users updateUserProfile(long userId, Users updatedUser);
    //byron
    List<Users> searchWalkers(String searchTerm);
}

