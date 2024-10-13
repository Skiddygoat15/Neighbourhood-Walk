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
    /*
    @Query("SELECT r FROM Request r " +
            "JOIN r.parent p " +
            "WHERE LOWER(r.departure) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(r.destination) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(FUNCTION('DATE_FORMAT', r.startTime, '%Y-%m-%d')) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(FUNCTION('DATE_FORMAT', r.arriveTime, '%Y-%m-%d')) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(r.details) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(r.status) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Request> searchRequests(@Param("search") String search);

    existsBy：这是 Spring Data JPA 的方法前缀，表示要检查某个记录是否存在。
    Parent：对应 Request 实体中的 parent 字段，该字段是 Users 类型的关联。
    UserId：对应 Users 实体中的 userId 字段。
    通过 _ 将关联字段分开，Spring Data JPA 会自动解析并生成相应的查询。
     */

    @Override
    Request getById(Integer integer);

    @Override
    Optional<Request> findById(Integer integer);

    long countByStatus(String status);
}
