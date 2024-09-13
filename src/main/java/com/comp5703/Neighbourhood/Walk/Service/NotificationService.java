package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;

public interface NotificationService {
    Notification addNotification(Notification notification);
    Notification findNotificationByWalkerRequestId(long walkerRequestId);
}
