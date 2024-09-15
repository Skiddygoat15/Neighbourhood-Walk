package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserProfileNotificationRepository extends JpaRepository<UserProfileNotification, Long>, JpaSpecificationExecutor<UserProfileNotification> {

}
