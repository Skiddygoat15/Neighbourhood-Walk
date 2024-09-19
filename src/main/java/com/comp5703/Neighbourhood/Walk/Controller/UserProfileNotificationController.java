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

    @GetMapping("/check-any-notification-unchecked")
    public ResponseEntity<Boolean> checkForUncheckedNotifications() {
        // 调用服务方法检查是否存在 NotificationCheck 为 false 的通知
        boolean hasUnchecked = notificationService.checkAnyNotificationUnchecked();

        // 返回布尔值作为响应，表示是否存在未检查的通知
        return new ResponseEntity<>(hasUnchecked, HttpStatus.OK);
    }

    @GetMapping("/allUPNotifications")
    public ResponseEntity<List<UserProfileNotification>> getAllUsers() {
        return new ResponseEntity<>(notificationService.getAllUserProfileNotifications(), HttpStatus.OK);
    }

    @GetMapping("/getUPNotificationsByUserId/{userId}")
    public ResponseEntity<?> getUPNByUserId(@PathVariable long userId) {
        try {
            // 调用服务层获取角色
            List<UserProfileNotificationDTO> UPNs = notificationService.getUPNotificationsByUserId(userId);

            // 返回角色列表
            return new ResponseEntity<>(UPNs, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // 处理用户未找到的情况，返回错误消息
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 处理其他异常，返回错误消息
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
