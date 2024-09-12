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
    private long walkerRequestId;

    @OneToOne
    @JoinColumn(name = "requestId")
    private Request request;

    @OneToOne
    @JoinColumn(name = "walkerId",referencedColumnName="userId")
    private Users walker;

    @Column(name = "status")
    private String status;

    public long getWalkerRequestId() {
        return walkerRequestId;
    }

    public void setWalkerRequestId(long walkerRequestId) {
        this.walkerRequestId = walkerRequestId;
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
}
