package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
import com.comp5703.Neighbourhood.Walk.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    // Create a character
    @PostMapping
    public ResponseEntity<?> createRole(@RequestParam long userId, @RequestBody String roleType) {
        try {
            RoleDTO newRole = roleService.saveRole(userId, roleType);
            return new ResponseEntity<>(newRole, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        List<RoleDTO> roleDTOs = roleService.getAllRoles();
        if (roleDTOs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(roleDTOs, HttpStatus.OK);
    }

    // Get all roles for a user based on the user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRolesByUserId(@PathVariable long userId) {
        try {
            // Calling the service layer to get the role
            List<RoleDTO> roles = roleService.getRolesByUserId(userId);

            // Back to Role List
            return new ResponseEntity<>(roles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Handles user not found cases, returning an error message
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handle other exceptions and return error messages
            return new ResponseEntity<>("An error occurred while fetching roles", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteRole(@RequestParam long userId, @RequestParam String roleType) {
        try {
            roleService.deleteRole(userId, roleType);
            return new ResponseEntity<>("Role deleted successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred during role deletion", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getRoleByUserIdAndRoleType")
    public ResponseEntity<?> getRoleByUserIdAndRoleType(@RequestParam("userId") long userId, @RequestParam("roleType") String roleType) {
        Role roleUserByUserIdAndRoleType;
        try {
            roleUserByUserIdAndRoleType = roleService.getRoleUserByUserIdAndRoleType(userId, roleType);
        } catch (RuntimeException e) {
            throw new RuntimeException("Role not found for user with id: " + userId + " and role type: " + roleType);
        }

        return new ResponseEntity<>(roleUserByUserIdAndRoleType, HttpStatus.OK);
    }

    @GetMapping("/getWalkerByUserId/{userId}")
    public ResponseEntity<?> getWalkerByUserId(@PathVariable long userId) {
        return new ResponseEntity<>(roleService.getWalkerByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/getParentByUserId/{userId}")
    public ResponseEntity<?> getParentByUserId(@PathVariable long userId) {
        return new ResponseEntity<>(roleService.getParentByUserId(userId), HttpStatus.OK);
    }
}
