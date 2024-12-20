package com.comp5703.Neighbourhood.Walk.Controller;
import com.comp5703.Neighbourhood.Walk.Entities.UserProfileDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/Users")
public class UsersController {
    @Autowired
    UsersService usersService;

    @GetMapping("/getUserProfileByUserId/{userId}")
    public ResponseEntity<UserProfileDTO> getUserProfileByUserId(@PathVariable long userId){
        UserProfileDTO userProfileDTO = usersService.getUserProfileById(userId);
        return new ResponseEntity<>(userProfileDTO, HttpStatus.OK);
    }

    @GetMapping("/getUserById/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable long userId){
        try {
            Users user = usersService.getUserById(userId);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (ResourceNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("/userNamesById/{userId}")
    public ResponseEntity<Map<String, String>> getUserNamesById(@PathVariable long userId) {
        Optional<Map<String, String>> userMap = usersService.getUserNamesById(userId);

        return userMap
                .map(map -> new ResponseEntity<>(map, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));  // Returns 404 if the user does not exist
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Users> getUsersByEmail(@PathVariable String email) {
        Optional<Users> user = usersService.getUsersByEmail(email);
        return user.map(users -> new ResponseEntity<>(users, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<Users> getUsersByPhone(@PathVariable String phone) {
        Optional<Users> user = usersService.getUsersByPhone(phone);
        return user.map(users -> new ResponseEntity<>(users, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Users> saveUsers(@RequestBody Users Users) {
        return new ResponseEntity<>(usersService.saveUsers(Users), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUsers(@PathVariable int id) {
        usersService.deleteUsers(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/blockUser/{id}")
    public ResponseEntity<HttpStatus> blockUser(@PathVariable int id) {
        usersService.blockUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/activeUser/{id}")
    public ResponseEntity<HttpStatus> activeUser(@PathVariable int id) {
        usersService.activeUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/allUsers")
    public ResponseEntity<List<Users>> getAllUsers() {
        return new ResponseEntity<>(usersService.getAllUsers(), HttpStatus.OK);
    }


    //byron
    @GetMapping("/searchWalkers")
    public ResponseEntity<?> searchWalkers(@RequestParam long parentId,
                                           @RequestParam String searchTerm,
                                           @RequestParam(required = false) String gender,
                                           @RequestParam(required = false) String distance,
                                           @RequestParam(required = false) String rating) {
        try {
            List<Users> walkers = usersService.searchWalkers(parentId, searchTerm, gender, distance, rating);
            return new ResponseEntity<>(walkers, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            // Handling custom exceptions for not found resources
            return new ResponseEntity<>(
                    Map.of("message", e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception e) {
            // Catch all other exceptions and return 500 server errors
            return new ResponseEntity<>(
                    Map.of("message", "An unexpected error occurred: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Users user, @RequestParam String roleType) {
        try {
            // Call the registerUser method of the service tier
            Users registeredUser = usersService.registerUser(user, roleType);

            // Return success response
            return new ResponseEntity<>("User registered successfully with ID: " + registeredUser.getId(), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Returns an error message with status code 400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handling other possible exceptions
            return new ResponseEntity<>("An error occurred during user registration", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{userId}/update-image")
    public ResponseEntity<String> updateUserImage(@PathVariable Long userId, @RequestBody String url) {
        int updatedRows = usersService.updateUserImgUrl(url, userId);
        if (updatedRows > 0) {
            return ResponseEntity.ok("User image updated successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to update user image.");
        }
    }

    @GetMapping("/getUserProfImgUrl/{userId}")
    public ResponseEntity<?> getUserProfImgUrl(@PathVariable long userId) {
        String url = usersService.findUserProfImgById(userId);
        return new ResponseEntity<>(url, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/registerOA")
    public ResponseEntity<String> updateUserViaAuth(@RequestBody Users user, @RequestParam String roleType, @RequestParam long userId) {
        try {
            // Call the service method to update user details
            Users updatedUser = usersService.updateUserViaAuth(user, roleType, userId);

            // Return success response
            return new ResponseEntity<>("User updated successfully with ID: " + userId, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Return error response if any validation fails
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Return internal server error for any other exception
            return new ResponseEntity<>("An error occurred during user update", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateUserProfile(@PathVariable long userId, @RequestBody Users updatedUser) {
        try {
            Users savedUser = usersService.updateUserProfile(userId, updatedUser);
            return new ResponseEntity<>(savedUser, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
//            return new ResponseEntity<>("An error occurred while updating user profile.", HttpStatus.INTERNAL_SERVER_ERROR);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = usersService.getTotalUsers();
        long activeUsers = usersService.getUsersByStatus("Active");
        long offlineUsers = usersService.getUsersByStatus("Offline");

        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("offlineUsers", offlineUsers);

        return ResponseEntity.ok(stats);
    }

}
