package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Integer> {
    List<Request> findByDeparture(String search);

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
}
