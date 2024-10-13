package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBar;
import org.springframework.data.repository.CrudRepository;

public interface ChatBarRepository extends CrudRepository<ChatBar, Long> {
    @Override
    <S extends ChatBar> S save(S entity);
    Iterable<ChatBar> findAllByUserFromId(long userFromId);
    ChatBar findByUserFromIdAndUserToId(Long userFromId, Long userToId);
}
