package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;
import com.comp5703.Neighbourhood.Walk.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/Notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> addNotification(@RequestBody Notification notification){
        return new ResponseEntity<>(notificationService.addNotification(notification), HttpStatus.OK);
    }

    @GetMapping("/findNotificationByWalkerRequestId/{walkerRequestId}")
    public ResponseEntity<Notification> findNotificationByWalkerRequestId(@PathVariable("walkerRequestId") long walkerRequestId) {
        return new ResponseEntity<>(notificationService.findNotificationByWalkerRequestId(walkerRequestId),HttpStatus.OK);
    }
}