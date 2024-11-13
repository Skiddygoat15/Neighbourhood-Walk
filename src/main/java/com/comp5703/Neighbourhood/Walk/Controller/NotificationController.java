package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.NotificationService;
import com.comp5703.Neighbourhood.Walk.Service.WalkerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/Notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private WalkerRequestService walkerRequestService;

    @PostMapping
    public ResponseEntity<Notification> addNotification(@RequestBody Notification notification){
        return new ResponseEntity<>(notificationService.addNotification(notification), HttpStatus.OK);
    }

    @GetMapping("/findNotificationByWalkerRequestId/{walkerRequestId}")
    public ResponseEntity<Notification> findNotificationByWalkerRequestId(@PathVariable("walkerRequestId") long walkerRequestId) {
        return new ResponseEntity<>(notificationService.findNotificationByWalkerRequestId(walkerRequestId),HttpStatus.OK);
    }

    @GetMapping("/findNotificationByWalkerId/{walkerId}")
    public ResponseEntity<List<Notification>> findNotificationByWalkerId(@PathVariable("walkerId") long walkerId) {
        return new ResponseEntity<>(notificationService.findNotificationByWalkerId(walkerId),HttpStatus.OK);
    }

    @GetMapping("/findNotificationByRequestId/{requestId}")
    public List<Notification> findNotificationByRequestId(@PathVariable("requestId") int requestId) {
        return notificationService.findNotificationByRequestId(requestId);
    }

    @GetMapping("/findWalkerByNotification/{notificationId}")
    public Users findWalkerByNotification(@PathVariable("notificationId") long notificationId) {
        return notificationService.findWalkerByNotification(notificationId);
    }

    @PostMapping("/checkNotification/{notificationId}")
    public String checkNotification(@PathVariable("notificationId")long notificationId) {
        return notificationService.checkNotification(notificationId);
    }

    @PostMapping("/closeNotification/{notificationId}")
    public String closeNotification(@PathVariable("notificationId")long notificationId) {
        return notificationService.closeNotification(notificationId);
    }
}
