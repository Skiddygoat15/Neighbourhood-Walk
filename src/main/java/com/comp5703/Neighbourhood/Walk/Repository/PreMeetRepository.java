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

    // 1. 根据 parentId 获取所有与该 parent 关联的 PreMeet
    List<PreMeet> findAllByParentUserId(long parentId);

    // 2. 根据 walkerId 获取所有与该 walker 关联的 PreMeet
    List<PreMeet> findAllByWalkerUserId(long walkerId);

    // 3. 根据 requestId 获取该 request 关联的 PreMeet
    Optional<PreMeet> findByRequest(Request request);

    // 自定义查询来检查某个 walkerId 的 PreMeet 中是否有 newOrNot 字段为 true 的记录
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END " +
            "FROM PreMeet p WHERE p.walker.userId = :walkerId AND p.newOrNot = true")
    boolean existsNewPreMeetByWalkerId(@Param("walkerId") long walkerId);
}
