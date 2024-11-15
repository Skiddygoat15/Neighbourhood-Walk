package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request, Integer>, JpaSpecificationExecutor<Request> {
    List<Request> findByParentId(Long parentId);
    List<Request> findByWalkerId(Long walkerId);


    @Override
    Request getById(Integer integer);

    @Override
    Optional<Request> findById(Integer integer);

    long countByStatus(String status);

    @Query("SELECT r.walker FROM Request r WHERE r.requestId = :requestId")
    Users findWalkerByRequestId(@Param("requestId") Integer requestId);
    @Query("SELECT r.parent FROM Request r WHERE r.requestId = :requestId")
    Users findParentByRequestId(@Param("requestId") Integer requestId);
}
