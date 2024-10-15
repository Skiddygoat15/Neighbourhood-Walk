package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;


import java.util.List;

public interface RoleService {
    RoleDTO saveRole(long userId, String roleType);
    List<RoleDTO> getAllRoles();
    List<RoleDTO> getRolesByUserId(long userId);
    void deleteRole(long roleId, String roleType);
    Role getRoleUserByUserIdAndRoleType(long userId, String roleType);
    RoleDTO getWalkerByUserId(long userId);
    RoleDTO getParentByUserId(long userId);
}

