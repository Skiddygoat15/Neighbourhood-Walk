package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotification;
import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotificationDTO;

import java.util.List;

public interface UserProfileNotificationService {
    public void saveUserProfileNotification(UserProfileNotification userProfileNotification);
    public List<UserProfileNotification> getAllUserProfileNotifications();
    public List<UserProfileNotificationDTO> getUPNotificationsByUserId(long userId);
    public void checkUPNotification(long id);
    public void closeUPNotification(long id);
    public boolean checkAnyNotificationUnchecked();
}
