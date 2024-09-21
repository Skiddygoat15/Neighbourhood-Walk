package com.comp5703.Neighbourhood.Walk.Entities;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
@Entity
@Table(name = "notification")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long notificationId;

    @OneToOne
    @JoinColumn(name = "walkerRequestId")
//    @JsonBackReference
    private WalkerRequest walkerRequest;

    @Column(name = "statusPrevious")
    private String statusPrevious;

    @Column(name = "statusChanged")
    private String statusChanged;

    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timezone = "UTC")
    @TableField(fill = FieldFill.INSERT) //标明该字段，在什么时候需要被填充
    private Date Time;

    @Column(name = "NotificationCheck")
    private boolean notificationCheck = false;

    @Column(name = "NotificationClose")
    private boolean notificationClose = false;

    public Notification() {}

    public Notification(WalkerRequest walkerRequest, String statusPrevious, String statusChanged) {
        this.walkerRequest = walkerRequest;
        this.statusPrevious = statusPrevious;
        this.statusChanged = statusChanged;
    }

    public Notification(WalkerRequest walkerRequest, String statusPrevious, String statusChanged, boolean notificationCheck, boolean notificationClose) {
        this.walkerRequest = walkerRequest;
        this.statusPrevious = statusPrevious;
        this.statusChanged = statusChanged;
        notificationCheck = notificationCheck;
        notificationClose = notificationClose;
    }


    public boolean isNotificationCheckFalse() {
        return notificationCheck;
    }

    public String getStatusChanged() {
        return statusChanged;
    }
}
