package com.comp5703.Neighbourhood.Walk.Entities;


import lombok.Data;

import java.util.Date;

@Data
public class ChatBoxDTO {

    private String roleFromRoleType;

    private String roleToRoleType;

    private String message;

    private Date time;

    private String chatRoomId;

}
