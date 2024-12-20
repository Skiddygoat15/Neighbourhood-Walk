package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotification;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface UserProfileNotificationRepository extends JpaRepository<UserProfileNotification, Long>, JpaSpecificationExecutor<UserProfileNotification> {
    List<UserProfileNotification> findByUser(Users user);
    boolean existsByUserIdAndNotificationCheckFalse(long userId);
}
