package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends CrudRepository<Role, Integer>{
    List<Role> findByUser(Users user);  // 根据 userId 查询所有角色
    Optional<Role> findByUserAndRoleType(Users user, String roleType);
}
