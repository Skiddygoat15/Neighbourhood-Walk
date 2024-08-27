package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    // 创建角色
    @PostMapping
    public ResponseEntity<Role> createRole(@RequestParam long userId, @RequestBody String roleType) {
        Role newRole = roleService.saveRole(userId, roleType);
        return new ResponseEntity<>(newRole, HttpStatus.CREATED);
    }

    // 获取所有角色
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        if (roles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    // 根据用户ID获取该用户的所有角色
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Role>> getRolesByUserId(@PathVariable long userId) {
        List<Role> roles = roleService.getRolesByUserId(userId);
        if (roles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }
}
