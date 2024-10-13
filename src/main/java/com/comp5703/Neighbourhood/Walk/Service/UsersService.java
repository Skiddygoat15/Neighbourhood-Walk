package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.UserProfileDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UsersService {
    Users saveUsers(Users user);
    //something
    Optional<Users> getUsersByEmail(String email);
    Optional<Users> getUsersByPhone(String phone);
    Optional<Map<String, String>> getUserNamesById(long id);
    UserProfileDTO getUserProfileById(long id);
    void activeUser(long id);
    void blockUser(long id);

    void deleteUsers(long id);
    List<Users> getAllUsers();

    Users getUserById(long id);

    Users registerUser(Users user, String roleType);
    Users updateUserProfile(long userId, Users updatedUser);
    //byron
    double calculateDistance(double lat1, double lon1, double lat2, double lon2);
    List<Users> searchWalkers(Long parentId, String searchTerm, String gender, String distance, String rating);
    Optional<Users> getUserByEmailOrPhone(String emailOrPhone);

    //admin user statistics
    long getTotalUsers();
    long getUsersByStatus(String status);

}

