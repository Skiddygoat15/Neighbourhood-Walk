package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotification;
import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotificationDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.UserProfileNotificationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/UPNotifications")
public class UserProfileNotificationController {
    @Autowired
    UserProfileNotificationService notificationService;

    @GetMapping("/check-any-notification-unchecked/{userId}")
    public ResponseEntity<Boolean> checkForUncheckedNotifications(@PathVariable long userId) {
        // Call the service method to check if a notification exists with NotificationCheck false.
        boolean hasUnchecked = notificationService.checkAnyNotificationUnchecked(userId);

        // Returns a boolean value as a response indicating whether there is an unchecked notification
        return new ResponseEntity<>(hasUnchecked, HttpStatus.OK);
    }

    @GetMapping("/check-any-notification-unchecked-parent/{userId}")
    public ResponseEntity<Boolean> checkForUncheckedNotifications_Parent(@PathVariable long userId) {
        // Call the service method to check if a notification exists with NotificationCheck false.
        boolean hasUnchecked = notificationService.checkAnyNotificationUnchecked_Parent(userId);

        // Returns a boolean value as a response indicating whether there is an unchecked notification
        return new ResponseEntity<>(hasUnchecked, HttpStatus.OK);
    }

    @GetMapping("/allUPNotifications")
    public ResponseEntity<List<UserProfileNotification>> getAllUsers() {
        return new ResponseEntity<>(notificationService.getAllUserProfileNotifications(), HttpStatus.OK);
    }

    @GetMapping("/getUPNotificationsByUserId/{userId}")
    public ResponseEntity<?> getUPNByUserId(@PathVariable long userId) {
        try {
            // Calling the service layer to get the role
            List<UserProfileNotificationDTO> UPNs = notificationService.getUPNotificationsByUserId(userId);

            // Back to Role List
            return new ResponseEntity<>(UPNs, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Handles user not found cases, returning an error message
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handle other exceptions and return error messages
            return new ResponseEntity<>("An error occurred while fetching user profile notifications", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/check/{id}")
    public ResponseEntity<String> checkNotification(@PathVariable Long id) {
        try {
            notificationService.checkUPNotification(id);
            return ResponseEntity.ok("Notification checked successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while checking the notification.");
        }
    }

    @PostMapping("/close/{id}")
    public ResponseEntity<String> closeNotification(@PathVariable Long id) {
        try {
            notificationService.closeUPNotification(id);
            return ResponseEntity.ok("Notification closed successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while closing the notification.");
        }
    }
}
