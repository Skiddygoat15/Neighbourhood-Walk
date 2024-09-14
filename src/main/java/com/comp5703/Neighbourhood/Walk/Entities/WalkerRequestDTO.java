package com.comp5703.Neighbourhood.Walk.Entities;

public class WalkerRequestDTO {
    private long walkerRequestId;
    private String status;
    private int requestId;
    private long walkerId;

    // Constructors
    public WalkerRequestDTO() {}

    public WalkerRequestDTO(long walkerRequestId, String status, int requestId, long walkerId) {
        this.walkerRequestId = walkerRequestId;
        this.status = status;
        this.requestId = requestId;
        this.walkerId = walkerId;
    }

    // Getters and Setters
    public long getWalkerRequestId() {
        return walkerRequestId;
    }

    public void setWalkerRequestId(long walkerRequestId) {
        this.walkerRequestId = walkerRequestId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getRequestId() {
        return requestId;
    }

    public void setRequestId(int requestId) {
        this.requestId = requestId;
    }

    public long getWalkerId() {
        return walkerId;
    }

    public void setWalkerId(long walkerId) {
        this.walkerId = walkerId;
    }
}
