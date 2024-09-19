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

    // 构造函数：从 PreMeet 实体中提取数据
    public PreMeetDTO(PreMeet preMeet) {
        this.preMeetId = preMeet.getPreMeetId();
        this.parentName = preMeet.getParent().getName(); // 从实体提取 parent 名字
        this.walkerName = preMeet.getWalker().getName(); // 从实体提取 walker 名字
        this.preMeetType = preMeet.getPreMeetType();
        this.contactApproach = preMeet.getContactApproach();
        this.urlOrAddress = preMeet.getUrlOrAddress();
        this.time = preMeet.getTime();
        this.newOrNot = preMeet.isNewOrNot();
    }
}
