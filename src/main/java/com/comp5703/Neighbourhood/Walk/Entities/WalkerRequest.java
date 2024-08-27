package com.comp5703.Neighbourhood.Walk.Entities;

import jakarta.persistence.*;

import java.util.Date;

//table bind walker and request
@Entity
public class WalkerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int walkerRequestId;

    @ManyToOne
    @JoinColumn(name = "requestId")
    private Request request;

    @ManyToOne
    @JoinColumn(name = "walkerId")
    private Users walker;

    @Column(name = "status")
    private String status;

    public int getWalkerRequestId() {
        return walkerRequestId;
    }

    public void setWalkerRequestId(int id) {
        this.walkerRequestId = id;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public Users getWalker() {
        return walker;
    }

    public void setWalker(Users walker) {
        this.walker = walker;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getRequestDate() {
        return request.getPublishDate();
    }
}
