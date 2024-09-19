package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;
import org.springframework.data.repository.CrudRepository;

public interface NotificationRepository extends CrudRepository<Notification, Long> {

    @Override
    <S extends Notification> S save(S entity);

    Notification findAllByWalkerRequest_WalkerRequestId(long walkerRequestId);
    // 查询是否有 NotificationCheck 为 false 的记录
    boolean existsByNotificationCheckFalse();
}
