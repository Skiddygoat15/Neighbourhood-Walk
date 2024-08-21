package com.comp5703.Neighbourhood.Walk.Entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "request")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int requestId;

    @Column(name = "walkerId")
    private int walkerId;

    @Column(name = "parentId")
    private int parentId;

    @Column(name = "publishDate")
    private Date publishDate;

    @Column(name = "startTime")
    private Date startTime;

    @Column(name = "arriveTime")
    private Date arriveTime;

    @Column(name = "departure")
    private String departure;

    @Column(name = "destination")
    private String destination;

    @Column(name = "details")
    private String details;

    @Column(name = "status")
    private String status;

}
