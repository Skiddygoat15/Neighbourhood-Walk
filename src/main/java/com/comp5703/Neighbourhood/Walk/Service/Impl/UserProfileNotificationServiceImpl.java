package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.*;
import com.comp5703.Neighbourhood.Walk.Repository.UserProfileNotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.UserProfileNotificationService;
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
                    userProfileNotification.getNotifyType()));
        }
        return UPNDTOs;
    }

}
