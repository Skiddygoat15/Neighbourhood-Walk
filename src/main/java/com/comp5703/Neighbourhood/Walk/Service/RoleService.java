package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Role;


import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

public interface RoleService {
    Role saveRole(long userId, String roleType);
    List<Role> getAllRoles();
    List<Role> getRolesByUserId(long userId);
}

