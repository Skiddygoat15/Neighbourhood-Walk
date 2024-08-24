package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

@Entity
@Table(name = "Comment")

public class Comment{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "commentId")
    private int commentId;
    @Column(name = "requestId", nullable = false)
    private String requestId;
    @Column(name = "userId", nullable = false)
    private String userId;
    @Column(name = "rate", nullable = false)
    private double rate;
    @Column(name = "comment", nullable = false)
    private String comment;
    @Column(name = "commentDate", nullable = false)
    @JsonFormat(pattern =  "yyyy-mm-dd hh:mm:ss")
    private String commentDate;


    public int getCommentId() {
        return commentId;
    }

    public void setCommentId(int commentId) {
        this.commentId = commentId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getCommentDate() {
        return commentDate;
    }

    public void setCommentDate(String commentDate) {
        this.commentDate = commentDate;
    }

}
