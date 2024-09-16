package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotification;
import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotificationDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.UserProfileNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/UPNotifications")
public class UserProfileNotificationController {
    @Autowired
    UserProfileNotificationService notificationService;

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
}
