package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NotificationRepository extends CrudRepository<Notification, Long> {

    @Override
    <S extends Notification> S save(S entity);

    Notification findAllByWalkerRequest_WalkerRequestId(long walkerRequestId);
    // 查询是否有 NotificationCheck 为 false 的记录
    List<Notification> findByWalkerRequest(WalkerRequest walkerRequest);

}
