package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonBackReference(value = "request-walker")
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

    @Column(name = "departureLatitude")
    private Double departureLatitude;

    @Column(name = "departureLongitude")
    private Double departureLongitude;

    @Column(name = "destination")
    private String destination;

    @Column(name = "destinationLatitude")
    private Double destinationLatitude;

    @Column(name = "destinationLongitude")
    private Double destinationLongitude;

    @Column(name = "details")
    private String details;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WalkerRequest> walkerRequests = new ArrayList<>();

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


    @Override
    public String toString() {
        return "Request{" +
                "walker=" + walker +
                '}';
    }

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

    public Double getDepartureLatitude() { return departureLatitude; }

    public void setDepartureLatitude(Double departureLatitude) { this.departureLatitude = departureLatitude; }

    public Double getDepartureLongitude() { return departureLongitude; }

    public void setDepartureLongitude(Double departureLongitude) { this.departureLongitude = departureLongitude; }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Double getDestinationLatitude() { return destinationLatitude; }

    public void setDestinationLatitude(Double destinationLatitude) { this.destinationLatitude = destinationLatitude; }

    public Double getDestinationLongitude() { return destinationLongitude; }

    public void setDestinationLongitude(Double destinationLongitude) { this.destinationLongitude = destinationLongitude; }

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
