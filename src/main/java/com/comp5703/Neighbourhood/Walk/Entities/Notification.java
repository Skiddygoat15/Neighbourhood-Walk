package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

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

    public Notification(WalkerRequest walkerRequest, String statusPrevious, String statusChanged) {
        this.walkerRequest = walkerRequest;
        this.statusPrevious = statusPrevious;
        this.statusChanged = statusChanged;
    }

    public Notification() {

    }
}
