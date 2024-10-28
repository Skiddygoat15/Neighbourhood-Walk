package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Entities.Request;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;


public interface CommentRepository extends CrudRepository<Comment, Long> {
    <S extends Comment> S save(S entity);
    List<Comment> findAllByUserId(long userId);
    Optional<Comment> findById(Long commentId);
    Optional<Comment> findByRequest(Request request);
}