package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.NotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.NotificationService;
import com.comp5703.Neighbourhood.Walk.exception.NotificationWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationWebSocketHandler notificationWebSocketHandler;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private WalkerRequestRepository walkerRequestRepository;

    @Autowired
    private WalkerRequestServiceImpl walkerRequestService;

    @Override
    public Notification addNotification(Notification notification) {

        WalkerRequest  walkerRequest = walkerRequestRepository.getById(notification.getWalkerRequest().getWalkerRequestId());
        System.out.println(notification.getWalkerRequest());
        if(notification.getWalkerRequest().getWalker() == null){
            notification.getWalkerRequest().setWalker(walkerRequest.getWalker());
        }
        System.out.println(notification.getWalkerRequest());
        Notification savedNotification = notificationRepository.save(notification);
        return savedNotification;
    }

    @Override
    public Notification findNotificationByWalkerRequestId(long walkerRequestId) {
        Notification notification = notificationRepository.findAllByWalkerRequest_WalkerRequestId(walkerRequestId);
        if (notification != null){
            return notificationRepository.findAllByWalkerRequest_WalkerRequestId(walkerRequestId);
        }else {
            return null;
        }
    }

    @Override
    public List<Notification> findNotificationByWalkerId(long walkerId) {
        List<WalkerRequest> walkerRequestList = walkerRequestService.getWalkerRequestByWalkerId(walkerId);

        List<Notification> notificationList = walkerRequestList.stream().map(walkerRequest -> {
            Notification notification = findNotificationByWalkerRequestId(walkerRequest.getWalkerRequestId());
            return notification;
        }).collect(Collectors.toList());

       return notificationList;
    }

    @Override
    public List<Notification> findNotificationByRequestId(int requestId) {
        List<WalkerRequest> walkerRequestList = walkerRequestService.getWalkerRequestByRequestId(requestId);
        List<Notification> notificationList = walkerRequestList.stream().map(walkerRequest -> {
            Notification notification = notificationRepository.findAllByWalkerRequest_WalkerRequestId(walkerRequest.getWalkerRequestId());
            return notification;
        }).collect(Collectors.toList());

        return notificationList;
    }

    @Override
    public Users findWalkerByNotification(long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).get();
        WalkerRequest walkerRequest = notification.getWalkerRequest();
        return walkerRequest.getWalker();
    }

    @Override
    public String checkNotification(long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()){
            if (!notification.get().isNotificationCheck()){
                notification.get().setNotificationCheck(true);
                notificationRepository.save(notification.get());
                return "Notification has been checked successfully.";
            }
        }
        return "Notification failed to be checked.";
    }

    @Override
    public String closeNotification(long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()){
            if (!notification.get().isNotificationClose()){
                notification.get().setNotificationClose(true);
                notificationRepository.save(notification.get());
                return "Notification has been closed successfully.";
            }
        }
        return "Notification failed to be closed.";
    }
}
