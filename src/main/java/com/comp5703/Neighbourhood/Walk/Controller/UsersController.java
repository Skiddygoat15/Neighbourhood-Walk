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
                .map(map -> new ResponseEntity<>(map, HttpStatus.OK))  // 返回 name 和 preferredName
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));  // 如果用户不存在，返回 404
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
            // 处理找不到资源的自定义异常
            return new ResponseEntity<>(
                    Map.of("message", e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception e) {
            // 捕获所有其他异常，并返回500服务器错误
            return new ResponseEntity<>(
                    Map.of("message", "An unexpected error occurred: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Users user, @RequestParam String roleType) {
        try {
            // 调用服务层的 registerUser 方法
            Users registeredUser = usersService.registerUser(user, roleType);

            // 返回成功响应
            return new ResponseEntity<>("User registered successfully with ID: " + registeredUser.getId(), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // 返回错误信息，状态码为400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 处理其他可能的异常
            return new ResponseEntity<>("An error occurred during user registration", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/oauthRegister")
    public ResponseEntity<String> registerUser_OAuth(@RequestBody Users user, @RequestParam String roleType) {
        try {
            // 调用服务层的 registerUser 方法
            Users registeredUser = usersService.registerUser_OAuth(user, roleType);

            // 返回成功响应
            return new ResponseEntity<>("User registered successfully with ID: " + registeredUser.getId(), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // 返回错误信息，状态码为400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 处理其他可能的异常
            return new ResponseEntity<>("An error occurred during user registration", HttpStatus.INTERNAL_SERVER_ERROR);
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
            return new ResponseEntity<>("An error occurred while updating user profile.", HttpStatus.INTERNAL_SERVER_ERROR);
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
