package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.NotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.NotificationService;
import com.comp5703.Neighbourhood.Walk.exception.NotificationWebSocketHandler;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        WalkerRequest walkerRequest = walkerRequestRepository.getById(notification.getWalkerRequest().getWalkerRequestId());
        notification.setWalkerRequest(walkerRequest);

        // 保存通知到数据库
        Notification savedNotification = null;
        try {
            savedNotification = notificationRepository.save(notification);
        } catch (Exception e) {
            throw new RuntimeException("The status of request can not change once it was decided.");
        } finally {
        }

        // 将 Notification 中的字段转换为前端需要的字段名
        Map<String, Object> notificationData = new HashMap<>();
        notificationData.put("parentId", walkerRequest.getRequest().getParent().getId());  // 假设 walkerRequest 有 getParentId 方法
        notificationData.put("walkerId", walkerRequest.getWalker().getId());  // 假设 walkerRequest 有 getWalkerId 方法
        notificationData.put("statusPrevious", savedNotification.getStatusPrevious());// 假设 walkerRequest 有 getWalkerId 方法
        notificationData.put("statusChanged", savedNotification.getStatusChanged()); // 使用 statusChanged 作为 status
        notificationData.put("time", savedNotification.getTime().toString()); // 使用创建时间

        // 通过 WebSocket 推送通知消息给客户端
        try {
            notificationWebSocketHandler.broadcast(notificationData);;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return savedNotification;
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

    @Override
    public List<Notification> findNotificationByWalkerId(long walkerId) {
        List<WalkerRequest> walkerRequestList = walkerRequestService.getWalkerRequestByWalkerId(walkerId);

        List<Notification> notificationList = walkerRequestList.stream().map(walkerRequest -> {
            Notification notification = findNotificationByWalkerRequestId(walkerRequest.getWalkerRequestId());
            return notification;
        }).collect(Collectors.toList());

       return notificationList;
    }

}
