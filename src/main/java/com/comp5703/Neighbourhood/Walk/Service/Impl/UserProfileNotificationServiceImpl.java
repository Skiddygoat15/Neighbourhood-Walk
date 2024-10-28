package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.*;
import com.comp5703.Neighbourhood.Walk.Repository.NotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UserProfileNotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import com.comp5703.Neighbourhood.Walk.Service.UserProfileNotificationService;
import com.comp5703.Neighbourhood.Walk.Service.WalkerRequestService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProfileNotificationServiceImpl implements UserProfileNotificationService {
    @Autowired
    UserProfileNotificationRepository notificationRepository;

    @Autowired
    UsersRepository usersRepository;

    @Autowired
    NotificationRepository n_notificationRepository; // Notification 表的repository

    @Autowired
    WalkerRequestServiceImpl walkerRequestService;

    @Autowired
    RequestService requestService;

    @Override
    public boolean checkAnyNotificationUnchecked(long userId) {
        // 1. 查询 UserProfileNotification 表中是否有 NotificationCheck 为 false 的记录
        boolean isAnyUserProfileNotificationUnchecked = notificationRepository.existsByUserIdAndNotificationCheckFalse(userId);

        // 2. 通过 walkerId (即 userId) 获取 WalkerRequest 列表
        List<WalkerRequest> walkerRequests = walkerRequestService.getWalkerRequestByWalkerId(userId);

        // 3. 根据这些 WalkerRequest 对象在 Notification 表中查找记录，并检查 NotificationCheck 字段和 statusChanged 字段
        boolean isAnyNotificationUnchecked = walkerRequests.stream()
                .anyMatch(walkerRequest -> {
                    List<Notification> notifications = n_notificationRepository.findByWalkerRequest(walkerRequest);
                    return notifications.stream().anyMatch(notification ->
                            !notification.isNotificationCheck() && // 直接检查 notificationCheck 为 false
                                    !notification.getStatusChanged().equals("Applied") // 确保 statusChanged 不为 "Applied"
                    );
                });

        // 4. 如果任何一张表中存在一条记录的 NotificationCheck 为 false，则返回 true
        return isAnyUserProfileNotificationUnchecked || isAnyNotificationUnchecked;
    }

    @Override
    public boolean checkAnyNotificationUnchecked_Parent(long userId) {
        // 1. 查询 UserProfileNotification 表中与 userId 关联的记录中是否有 NotificationCheck 为 false 的记录
        boolean isAnyUserProfileNotificationUnchecked = notificationRepository.existsByUserIdAndNotificationCheckFalse(userId);

        // 2. 通过 parentId (即 userId) 获取 Request 列表
        List<Request> requests = requestService.getRequestsByUserId(userId);

        // 3. 遍历每个 Request，获取与其关联的 WalkerRequest
        boolean isAnyNotificationUnchecked = requests.stream()
                .flatMap(request -> walkerRequestService.getWalkerRequestByRequestId(request.getRequestId()).stream()) // 获取 WalkerRequest 列表
                .anyMatch(walkerRequest -> {
                    // 根据 WalkerRequest 在 Notification 表中查找记录
                    List<Notification> notifications = n_notificationRepository.findByWalkerRequest(walkerRequest);
                    // 遍历 Notification 检查 NotificationCheck 字段
                    return notifications.stream().anyMatch(notification ->
                            !notification.isNotificationCheck() // 检查 NotificationCheck 为 false
                    );
                });

        // 4. 如果任何表中存在一条记录的 NotificationCheck 为 false，则返回 true
        return isAnyUserProfileNotificationUnchecked || isAnyNotificationUnchecked;
    }





    @Override
    public void saveUserProfileNotification(UserProfileNotification userProfileNotification) {
        notificationRepository.save(userProfileNotification);
    }

    @Override
    public List<UserProfileNotification> getAllUserProfileNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public List<UserProfileNotificationDTO> getUPNotificationsByUserId(long userId) {
        Optional<Users> user = usersRepository.findById(userId);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        List<UserProfileNotification> UPNs = notificationRepository.findByUser(user.get());

        List<UserProfileNotificationDTO> UPNDTOs = new ArrayList<>();
        for (UserProfileNotification userProfileNotification : UPNs) {
            UPNDTOs.add(new UserProfileNotificationDTO(
                    userProfileNotification.getTime(),
                    userProfileNotification.getMessage(),
                    userProfileNotification.getNotifyType(),
                    userProfileNotification.getUPNotifyId(),
                    userProfileNotification.isNotificationClose(),
                    userProfileNotification.isNotificationCheck()));

        }
        return UPNDTOs;
    }


    // 方法：将 NotificationCheck 设置为 true
    @Override
    public void checkUPNotification(long notificationId) {
        UserProfileNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with ID: " + notificationId));
        notification.setNotificationCheck(true);
        notificationRepository.save(notification);
    }

    // 方法：将 NotificationClose 设置为 true
    @Override
    public void closeUPNotification(long notificationId) {
        UserProfileNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with ID: " + notificationId));
        notification.setNotificationClose(true);
        notificationRepository.save(notification);
    }

}
