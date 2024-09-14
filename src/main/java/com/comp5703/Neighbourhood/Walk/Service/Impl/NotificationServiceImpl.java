package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.NotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.NotificationService;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private WalkerRequestRepository walkerRequestRepository;

    @Override
    public Notification addNotification(Notification notification) {
        WalkerRequest walkerRequest = walkerRequestRepository.getById(notification.getWalkerRequest().getWalkerRequestId());
        notification.setWalkerRequest(walkerRequest);
        return notificationRepository.save(notification);
    }

    /**
     * 查找WalkerRequestId对应的Notification
     * @param walkerRequestId
     * @return
     */
    @Override
    public Notification findNotificationByWalkerRequestId(long walkerRequestId) {
        Notification notification = notificationRepository.findAllByWalkerRequest_WalkerRequestId(walkerRequestId);
        if (notification != null){
            return notificationRepository.findAllByWalkerRequest_WalkerRequestId(walkerRequestId);
        }else {
            throw new ResourceNotFoundException("Does not have the notification with it's walkerRequestId is " + walkerRequestId);
        }
    }


}
