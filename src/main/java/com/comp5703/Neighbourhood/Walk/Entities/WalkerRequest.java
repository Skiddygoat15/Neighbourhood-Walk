package com.comp5703.Neighbourhood.Walk.Entities;

import jakarta.persistence.*;

import java.util.Date;

//table bind walker and request
@Entity
//@Table(name = "WALKER_REQUEST", uniqueConstraints = {
//        @UniqueConstraint(columnNames = {"requestId", "walkerId"})
//}) // make sure the combination of requestId and walkerId is unique
public class WalkerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int walkerRequestId;

    @Column(name = "requestId", nullable = false)
    private int requestId;

    @Column(name = "walkerId", nullable = false)
    private long walkerId;

    @Column(name = "status")
    private String status;

//    @ManyToOne
//    @JoinColumn(name = "requestId")
//    private Request request;
//
//    @ManyToOne
//    @JoinColumn(name = "walkerId")
//    private Users walker;

    public int getRequestId() {
        return requestId;
    }

    public void setRequestId(int requestId) {
        this.requestId = requestId;
    }

    public long getWalkerId() {
        return walkerId;
    }

    public void setWalkerId(int walkerId) {
        this.walkerId = walkerId;
    }

    public int getWalkerRequestId() {
        return walkerRequestId;
    }

    public void setWalkerRequestId(int id) {
        this.walkerRequestId = id;
    }

//    public Request getRequest() {
//        return request;
//    }
//
//    public void setRequest(Request request) {
//        this.request = request;
//    }
//
//    public Users getWalker() {
//        return walker;
//    }
//
//    public void setWalker(Users walker) {
//        this.walker = walker;
//    }
//
//    public Date getRequestDate() {
//        return request.getPublishDate();
//    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


}
