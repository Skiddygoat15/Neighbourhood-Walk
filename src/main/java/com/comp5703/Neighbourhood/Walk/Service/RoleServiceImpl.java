package com.comp5703.Neighbourhood.Walk.Service;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
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
    public RoleDTO saveRole(long userId, String roleType) {
        Optional<Users> userOptional = usersRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }

        if (!roleType.equals("parent") && !roleType.equals("walker") && !roleType.equals("admin")){
            throw new IllegalArgumentException("Invalid role type: " + roleType);
        };

        Users user = userOptional.get();

        // 检查用户是否已经拥有相同的角色类型
        List<Role> existingRoles = roleRepository.findByUser(user);
        for (Role role : existingRoles) {
            if (role.getRoleType().equals(roleType)) {
                throw new IllegalArgumentException("User already has the role type: " + roleType);
            }
        }

        Role role = new Role(user, roleType);
        Role savedRole = roleRepository.save(role);

        // 创建并返回 RoleDTO
        return new RoleDTO(
                savedRole.getRoleId(),
                savedRole.getRoleType(),
                user.getId(),
                user.getPhone(),
                user.getEmail(),
                user.getName(),
                user.getSurname()
        );
    }

    @Override
    public List<RoleDTO> getAllRoles() {
        List<Role> roles = new ArrayList<>();
        roleRepository.findAll().forEach(roles::add);

        // 转换为 RoleDTO 列表
        List<RoleDTO> roleDTOs = new ArrayList<>();
        for (Role role : roles) {
            roleDTOs.add(new RoleDTO(
                    role.getRoleId(),
                    role.getRoleType(),
                    role.getUser().getId(),  // 获取 userId
                    role.getUser().getPhone(),   // 获取 phone
                    role.getUser().getEmail(),    // 获取 email
                    role.getUser().getName(),
                    role.getUser().getSurname()
            ));
        }
        return roleDTOs;
    }

    @Override
    public List<RoleDTO> getRolesByUserId(long userId) {
        Optional<Users> user = usersRepository.findById(userId);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        List<Role> roles = roleRepository.findByUser(user.get());

        List<RoleDTO> roleDTOs = new ArrayList<>();
        for (Role role : roles) {
            roleDTOs.add(new RoleDTO(
                    role.getRoleId(),
                    role.getRoleType(),
                    user.get().getId(),
                    user.get().getPhone(),
                    user.get().getEmail(),
                    user.get().getName(),
                    user.get().getSurname()));
        }
        return roleDTOs;
    }

}
