package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.apache.catalina.User;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
@Entity
@Table(name = "request")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int requestId;

    @ManyToOne
    @JoinColumn(name = "walkerId", referencedColumnName = "userId")
    private Users walker;

    @ManyToOne
    @JoinColumn(name = "parentId", referencedColumnName = "userId")
    private Users parent;

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

    @OneToMany(mappedBy = "walkerRequestId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WalkerRequest> walkerRequestId = new ArrayList<>();

//    public Long getWalkerId() {
//        return walkerId;
//    }
//
//    public void setWalkerId(Long walkerId) {
//        this.walkerId = walkerId;
//    }
//
//    public Long getParentId() {
//        return parentId;
//    }
//
//    public void setParentId(Long parentId) {
//        this.parentId = parentId;
//    }


    public Request(int requestId) {
        this.requestId = requestId;
    }

    public Request() {

    }

    public int getRequestId() {
        return requestId;
    }

    public void setRequestId(int requestId) {
        this.requestId = requestId;
    }

    public Users getWalker() {
        return walker;
    }

    public void setWalker(Users walker) {
        this.walker = walker;
    }

    public Users getParent() {
        return parent;
    }

    public void setParent(Users parent) {
        this.parent = parent;
    }

    public Date getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(Date publishDate) {
        this.publishDate = publishDate;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getArriveTime() {
        return arriveTime;
    }

    public void setArriveTime(Date arriveTime) {
        this.arriveTime = arriveTime;
    }

    public String getDeparture() {
        return departure;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
