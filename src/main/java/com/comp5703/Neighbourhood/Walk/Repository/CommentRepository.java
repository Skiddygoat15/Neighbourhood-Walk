package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


public interface CommentRepository extends CrudRepository<Comment, Integer> {
    <S extends Comment> S save(S entity);

//    @Override
//    List<Comment> findAllByUserId();

    List<Comment> findAllByUserId(String userId);

}

