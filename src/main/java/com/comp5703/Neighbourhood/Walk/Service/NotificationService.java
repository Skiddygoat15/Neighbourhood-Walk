package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;

import java.util.List;

public interface NotificationService {
    Notification addNotification(Notification notification);
    Notification findNotificationByWalkerRequestId(long walkerRequestId);
    List<Notification> findNotificationByWalkerId(long walkerId);

}
