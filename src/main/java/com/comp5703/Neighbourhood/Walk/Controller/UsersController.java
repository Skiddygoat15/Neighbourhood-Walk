package com.comp5703.Neighbourhood.Walk.Controller;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Users")
public class UsersController {
    @Autowired
    UsersService usersService;

    @GetMapping("/email/{email}")
    public ResponseEntity<Users> getUsersByEmail(@PathVariable String email) {
        Optional<Users> user = usersService.getUsersByEmail(email);
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

    @GetMapping("/allUsers")
    public ResponseEntity<List<Users>> getAllUsers() {
        return new ResponseEntity<>(usersService.getAllUsers(), HttpStatus.OK);
    }

    //byron
    @GetMapping("/searchWalkers")
    public ResponseEntity<List<Users>> searchWalkers(@RequestParam String search) {
        List<Users> walkers = usersService.searchWalkers(search);
        return new ResponseEntity<>(walkers, HttpStatus.OK);
    }
}
