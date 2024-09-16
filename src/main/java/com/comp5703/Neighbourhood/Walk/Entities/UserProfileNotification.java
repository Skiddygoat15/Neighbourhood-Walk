package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "UserProfileNotification")
public class UserProfileNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "User_Profile_NotifyId")
    private long UPNotifyId;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
    private Users user;

    @Column(name = "notifyType")
    private String notifyType;

    @Column(name = "message")
    private String message;

    @Column(name = "time")
    private Date time;

    public UserProfileNotification() {}

    public UserProfileNotification(Users user, String notifyType, String message, Date time) {
        this.user = user;
        this.notifyType = notifyType;
        this.message = message;
        this.time = time;
    }
}
