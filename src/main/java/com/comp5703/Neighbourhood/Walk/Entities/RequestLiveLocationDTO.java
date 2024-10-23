package com.comp5703.Neighbourhood.Walk.Entities;

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
    private Double parentLatitude;
    private Double parentLongitude;
    private Double walkerLatitude;
    private Double walkerLongitude;
}