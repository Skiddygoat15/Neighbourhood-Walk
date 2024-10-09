package com.comp5703.Neighbourhood.Walk.Entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PreMeet")
public class PreMeet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preMeetId")
    private long preMeetId;

    // Many PreMeet entities will reference one User (as parent)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parentId", referencedColumnName = "userId", nullable = false)
    private Users parent;

    // Many PreMeet entities will reference one User (as walker)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "walkerId", referencedColumnName = "userId", nullable = false)
    private Users walker;

    // One Request will reference one PreMeet
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requestId", referencedColumnName = "requestId", nullable = false)
    private Request request;

    @Column(name = "time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;

    @Column(name = "preMeetType")
    private String preMeetType;

    @Column(name = "contactApproach")
    private String contactApproach;

    @Column(name = "urlOrAddress")
    private String urlOrAddress;

    @Column(name = "newOrNot")
    private boolean newOrNot = true;
}

