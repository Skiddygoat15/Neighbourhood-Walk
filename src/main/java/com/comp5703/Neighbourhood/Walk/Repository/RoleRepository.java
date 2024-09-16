package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends CrudRepository<Role, Long>{
    List<Role> findByUserId(Users user);  // 根据 userId 查询所有角色
    Optional<Role> findByUserIdAndRoleType(Users user, String roleType);
}
