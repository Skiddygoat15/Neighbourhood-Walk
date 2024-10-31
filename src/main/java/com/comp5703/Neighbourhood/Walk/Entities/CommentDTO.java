package com.comp5703.Neighbourhood.Walk.Entities;

import lombok.Data;

@Data
public class CommentDTO {

    private long commentId;

    private Request request;

    private Long userId;

    private double rate;

    private String comment;

    private String commentDate;
}
