package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
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

    // 根据用户ID获取该用户的所有角色
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRolesByUserId(@PathVariable long userId) {
        try {
            // 调用服务层获取角色
            List<RoleDTO> roles = roleService.getRolesByUserId(userId);

            // 返回角色列表
            return new ResponseEntity<>(roles, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // 处理用户未找到的情况，返回错误消息
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 处理其他异常，返回错误消息
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
}
