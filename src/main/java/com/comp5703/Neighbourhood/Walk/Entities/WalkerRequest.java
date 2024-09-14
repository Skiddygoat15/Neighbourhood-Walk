package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;

//table bind walker and request
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
//@Table(name = "walker_request", uniqueConstraints = {
//        @UniqueConstraint(columnNames = {"requestId", "walkerId"})
//}) // make sure the combination of requestId and walkerId is unique
public class WalkerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long walkerRequestId;

    @ManyToOne
    @JoinColumn(name = "requestId")
    private Request request;

    @ManyToOne // 多个 WalkerRequest 可以对应同一个 walker
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
