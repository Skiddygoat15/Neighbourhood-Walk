package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface ChatBoxRepository extends CrudRepository<ChatBox, Long>{
    <S extends ChatBox> S save(S entity);
    List<ChatBox> findAllByRoleFromAndRoleTo(Role roleFrom, Role roleTo);
    @Override
    Optional<ChatBox> findById(Long chatBoxId);
}
