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
public class RequestDTO {
    private int requestId;
    private Users walker;
    private Users parent;
    private Date publishDate;
    private Date startTime;
    private Date arriveTime;
    private String departure;
    private String destination;
    private String details;
    private String status;
}
