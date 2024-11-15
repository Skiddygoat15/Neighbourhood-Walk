package com.comp5703.Neighbourhood.Walk.Entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PreMeetDTO {
    private Long preMeetId;
    private String parentName;
    private String walkerName;
    private String preMeetType;
    private String contactApproach;
    private String urlOrAddress;
    private Date time;
    private boolean newOrNot;


    public PreMeetDTO(PreMeet preMeet) {
        this.preMeetId = preMeet.getPreMeetId();
        this.parentName = preMeet.getParent().getName();
        this.walkerName = preMeet.getWalker().getName();
        this.preMeetType = preMeet.getPreMeetType();
        this.contactApproach = preMeet.getContactApproach();
        this.urlOrAddress = preMeet.getUrlOrAddress();
        this.time = preMeet.getTime();
        this.newOrNot = preMeet.isNewOrNot();
    }
}
