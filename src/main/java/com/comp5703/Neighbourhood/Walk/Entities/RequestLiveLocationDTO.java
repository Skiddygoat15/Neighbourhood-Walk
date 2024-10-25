package com.comp5703.Neighbourhood.Walk.Entities;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestLiveLocationDTO {
    private int requestId;

    private Users walker;
    private Users parent;

    private Date startTime;
    private Date arriveTime;
    private String status;

    private String departure;
    private Double departureLatitude;
    private Double departureLongitude;

    private String destination;
    private Double destinationLatitude;
    private Double destinationLongitude;

    private Double parentLatitude;
    private Double parentLongitude;

    private Double walkerLatitude;
    private Double walkerLongitude;

}
