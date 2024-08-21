package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Roles;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface RolesService {
    Roles saveRoles(Roles role);

    Optional<Roles> getRolesByRolesType(String rolesType);

    Roles getUserRoles();
}
