package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.*;
import com.comp5703.Neighbourhood.Walk.Repository.NotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UserProfileNotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.UserProfileNotificationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserProfileNotificationServiceImpl implements UserProfileNotificationService {
    @Autowired
    UserProfileNotificationRepository notificationRepository;

    @Autowired
    UsersRepository usersRepository;

    @Autowired
    NotificationRepository n_notificationRepository; // Notification 表的repository

    public boolean checkAnyNotificationUnchecked() {
        // 查询 UserProfileNotification 表中是否有 NotificationCheck 为 false 的记录
        boolean isAnyUserProfileNotificationUnchecked = notificationRepository.existsByNotificationCheckFalse();

        // 查询 Notification 表中是否有 NotificationCheck 为 false 的记录
        boolean isAnyNotificationUnchecked = n_notificationRepository.existsByNotificationCheckFalse();

        // 如果任何一张表中存在一条记录的 NotificationCheck 为 false，则返回 true
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
