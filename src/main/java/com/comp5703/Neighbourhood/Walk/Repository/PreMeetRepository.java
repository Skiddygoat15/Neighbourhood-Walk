package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.PreMeet;
import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotification;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PreMeetRepository extends JpaRepository<PreMeet, Long> {

    List<PreMeet> findAllByParentUserId(long parentId);

    List<PreMeet> findAllByWalkerUserId(long walkerId);


    Optional<PreMeet> findByRequest(Request request);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END " +
            "FROM PreMeet p WHERE p.walker.userId = :walkerId AND p.newOrNot = true")
    boolean existsNewPreMeetByWalkerId(@Param("walkerId") long walkerId);
}
