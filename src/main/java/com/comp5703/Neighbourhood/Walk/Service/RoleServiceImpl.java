package com.comp5703.Neighbourhood.Walk.Service;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.RoleRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UsersRepository usersRepository;

    @Override
    public Role saveRole(long userId, String roleType) {
        // 尝试获取用户，处理用户不存在的情况
        Optional<Users> userOptional = usersRepository.findById(userId);
        if (!userOptional.isPresent()) {
            // 可以抛出一个自定义的异常，或者返回 null，视业务需求而定
            throw new RuntimeException("User not found with id: " + userId);
        }

        Users user = userOptional.get();
        Role role = new Role(user, roleType); // 创建一个新的 Role 实例
        return roleRepository.save(role);
    }

    @Override
    public List<Role> getAllRoles() {
        List<Role> roles = new ArrayList<>();
        roleRepository.findAll().forEach(roles::add);
        return roles;
    }

    @Override
    public List<Role> getRolesByUserId(long userId) {
        Optional<Users> user = usersRepository.findById(userId);
        if (!user.isPresent()) {
            // 抛出异常或处理用户不存在的情况
            throw new RuntimeException("User not found with id: " + userId);
        }
        return roleRepository.findByUserId(user.get());
    }

}
