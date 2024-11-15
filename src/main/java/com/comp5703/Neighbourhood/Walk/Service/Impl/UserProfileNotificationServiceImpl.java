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
    NotificationRepository n_notificationRepository; // Notification table repository

    @Autowired
    WalkerRequestServiceImpl walkerRequestService;

    @Autowired
    RequestService requestService;

    @Override
    public boolean checkAnyNotificationUnchecked(long userId) {
        // 1. Query the UserProfileNotification table for NotificationCheck records that are false.
        boolean isAnyUserProfileNotificationUnchecked = notificationRepository.existsByUserIdAndNotificationCheckFalse(userId);

        // 2. Get a list of WalkerRequests by walkerId (i.e. userId)
        List<WalkerRequest> walkerRequests = walkerRequestService.getWalkerRequestByWalkerId(userId);

        // 3. Look for records in the Notification table based on these WalkerRequest objects and check the NotificationCheck field and the statusChanged field
        boolean isAnyNotificationUnchecked = walkerRequests.stream()
                .anyMatch(walkerRequest -> {
                    List<Notification> notifications = n_notificationRepository.findByWalkerRequest(walkerRequest);
                    return notifications.stream().anyMatch(notification ->
                            !notification.isNotificationCheck() &&
                                    !notification.getStatusChanged().equals("Applied")
                    );
                });

        // 4. Returns true if NotificationCheck is false for a row in any table.
        return isAnyUserProfileNotificationUnchecked || isAnyNotificationUnchecked;
    }

    @Override
    public boolean checkAnyNotificationUnchecked_Parent(long userId) {
        // 1. Query the UserProfileNotification table to see if any of the records associated with the userId have a NotificationCheck of false.
        boolean isAnyUserProfileNotificationUnchecked = notificationRepository.existsByUserIdAndNotificationCheckFalse(userId);

        // 2. Get a list of Requests by parentId (i.e. userId).
        List<Request> requests = requestService.getRequestsByUserId(userId);

        // 3. Iterate through each Request and get the WalkerRequest associated with it.
        boolean isAnyNotificationUnchecked = requests.stream()
                .flatMap(request -> walkerRequestService.getWalkerRequestByRequestId(request.getRequestId()).stream()) // Get a list of WalkerRequests
                .anyMatch(walkerRequest -> {
                    // Finding a record in the Notification table based on a WalkerRequest
                    List<Notification> notifications = n_notificationRepository.findByWalkerRequest(walkerRequest);
                    // loop Notification check NotificationCheck
                    return notifications.stream().anyMatch(notification ->
                            !notification.isNotificationCheck() // check NotificationCheck is false
                    );
                });

        // 4. Returns true if NotificationCheck is false for a row in any table.
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


    // Method: Set NotificationCheck to true
    @Override
    public void checkUPNotification(long notificationId) {
        UserProfileNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with ID: " + notificationId));
        notification.setNotificationCheck(true);
        notificationRepository.save(notification);
    }

    // Method: set NotificationClose to true
    @Override
    public void closeUPNotification(long notificationId) {
        UserProfileNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with ID: " + notificationId));
        notification.setNotificationClose(true);
        notificationRepository.save(notification);
    }

}
