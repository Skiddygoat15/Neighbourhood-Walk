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
    public Role saveRole(long userId, String roleType) {
        // ���Ի�ȡ�û��������û������ڵ����
        Optional<Users> userOptional = usersRepository.findById(userId);
        if (!userOptional.isPresent()) {
            // �����׳�һ���Զ�����쳣�����߷��� null����ҵ���������
            throw new RuntimeException("User not found with id: " + userId);
        }

        Users user = userOptional.get();
        Role role = new Role(user, roleType); // ����һ���µ� Role ʵ��
        return roleRepository.save(role);
    }

    @Override
    public List<Role> getAllRoles() {
        List<Role> roles = new ArrayList<>();
        roleRepository.findAll().forEach(roles::add);
        return roles;
    }

    @Override
    public List<RoleDTO> getRolesByUserId(long userId) {
        Optional<Users> user = usersRepository.findById(userId);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        List<Role> roles = roleRepository.findByUserId(user.get());

        // ת��Ϊ RoleDTO �б�
        List<RoleDTO> roleDTOs = new ArrayList<>();
        for (Role role : roles) {
            roleDTOs.add(new RoleDTO(
                    role.getRoleId(),
                    role.getRoleType(),
                    user.get().getId(),
                    user.get().getPhone(),
                    user.get().getEmail()));
        }
        return roleDTOs;
    }

}
