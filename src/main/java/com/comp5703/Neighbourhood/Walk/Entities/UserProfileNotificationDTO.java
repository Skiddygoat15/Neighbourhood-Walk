package com.comp5703.Neighbourhood.Walk.Entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserProfileNotificationDTO {

    private Date time;
    private String message;
    private String notifyType;
    private long notifyId;
    private boolean notificationClose;
    private boolean notificationCheck;
}
