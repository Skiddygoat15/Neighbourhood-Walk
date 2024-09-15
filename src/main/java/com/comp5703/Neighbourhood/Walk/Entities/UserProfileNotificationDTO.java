package com.comp5703.Neighbourhood.Walk.Entities;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UserProfileNotificationDTO {
    private Date time;
    private String message;
    private String notifyType;

    public UserProfileNotificationDTO(Date time, String message, String notifyType) {
        this.time = time;
        this.message = message;
        this.notifyType = notifyType;
    }
}
