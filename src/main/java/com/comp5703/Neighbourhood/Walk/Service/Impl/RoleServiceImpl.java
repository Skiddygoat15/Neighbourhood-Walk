package com.comp5703.Neighbourhood.Walk.Service.Impl;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.RoleRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.RoleService;
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

        if (!roleType.equals("parent") && !roleType.equals("walker") && !roleType.equals("admin")) {
            throw new IllegalArgumentException("Invalid role type: " + roleType);
        }
        ;

        Users user = userOptional.get();

        // 检查用户是否已经拥有相同的角色类型
        List<Role> existingRoles = roleRepository.findByUserId(user);
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
        List<Role> roles = roleRepository.findByUserId(user.get());

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

    @Override
    public void deleteRole(long userId, String roleType) {
        Optional<Users> userOptional = usersRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }

        Users user = userOptional.get();

        // 查找用户是否拥有该角色类型
        Optional<Role> roleOptional = roleRepository.findByUserIdAndRoleType(user, roleType);
        if (roleOptional.isEmpty()) {
            throw new IllegalArgumentException("Role not found for user with id: " + userId + " and role type: " + roleType);
        }

        // 获取用户的所有角色
        List<Role> roles = roleRepository.findByUserId(user);
        if (roles.size() == 1) {
            throw new IllegalArgumentException("Cannot delete the only role of the user");
        }

        // 删除角色
        roleRepository.delete(roleOptional.get());
    }

    @Override
    public Role getRoleUserByUserIdAndRoleType(long userId, String roleType) {
        Optional<Users> userOptional = usersRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        Users user = userOptional.get();
        Optional<Role> roleOptional = roleRepository.findByUserIdAndRoleType(user, roleType);
        if (roleOptional.isEmpty()) {
            throw new IllegalArgumentException("Role not found for user with id: " + userId + " and role type: " + roleType);
        }

        return roleOptional.get();
    }

    @Override
    public RoleDTO getWalkerByUserId(long userId) {
        Users userCheck = usersRepository.getById(userId);
        if (userCheck == null) {
            throw new IllegalArgumentException("User not found");
        }

        List<Role> roleList = roleRepository.findByUserId(userCheck);
        if (roleList.isEmpty()) {
            throw new IllegalArgumentException("The user has no roles");
        }

        Role parentRole = roleList.stream()
                .filter(role -> "walker".equals(role.getRoleType()))
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("The user is not a walker"));

        // Create a new RoleDTO from the Role entity
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setRoleId(parentRole.getRoleId());
        roleDTO.setRoleType(parentRole.getRoleType());
        roleDTO.setUserId(parentRole.getUser().getId());
        roleDTO.setPhone(parentRole.getUser().getPhone()); // Assuming Users has a phone field
        roleDTO.setEmail(parentRole.getUser().getEmail()); // Assuming Users has an email field
        roleDTO.setName(parentRole.getUser().getName());   // Assuming Users has a name field
        roleDTO.setSurName(parentRole.getUser().getSurname()); // Assuming Users has a surname field

        return roleDTO;
    }

    @Override
    public RoleDTO getParentByUserId(long userId) {
        Users userCheck = usersRepository.getById(userId);
        if (userCheck == null) {
            throw new IllegalArgumentException("User not found");
        }

        List<Role> roleList = roleRepository.findByUserId(userCheck);
        if (roleList.isEmpty()) {
            throw new IllegalArgumentException("The user has no roles");
        }

        Role parentRole = roleList.stream()
                .filter(role -> "parent".equals(role.getRoleType()))
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("The user is not a parent"));

        // Create a new RoleDTO from the Role entity
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setRoleId(parentRole.getRoleId());
        roleDTO.setRoleType(parentRole.getRoleType());
        roleDTO.setUserId(parentRole.getUser().getId());
        roleDTO.setPhone(parentRole.getUser().getPhone()); // Assuming Users has a phone field
        roleDTO.setEmail(parentRole.getUser().getEmail()); // Assuming Users has an email field
        roleDTO.setName(parentRole.getUser().getName());   // Assuming Users has a name field
        roleDTO.setSurName(parentRole.getUser().getSurname()); // Assuming Users has a surname field

        return roleDTO;
    }
}
