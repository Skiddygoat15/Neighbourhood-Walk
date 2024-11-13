package com.comp5703.Neighbourhood.Walk.Entities;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class WalkerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long walkerRequestId;

    @ManyToOne
    @JoinColumn(name = "requestId")
    private Request request;

    @ManyToOne // Multiple WalkerRequests can correspond to the same walker
    @JoinColumn(name = "walkerId",referencedColumnName="userId")
    private Users walker;

    @Column(name = "status")
    private String status;

    @Override
    public String toString() {
        return "WalkerRequest{" +
                "walkerRequestId=" + walkerRequestId +
                ", request=" + request +
                ", walker=" + walker +
                ", status='" + status + '\'' +
                '}';
    }

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
