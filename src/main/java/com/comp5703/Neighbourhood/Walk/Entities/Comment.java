package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

@Entity
@Table(name = "Comment")

public class Comment{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "commentId")
    private long commentId;
    @Column(name = "requestId", nullable = false)
    private long requestId;
//    @Column(name = "userId", nullable = false)
//    private long userId;
    // 关联 Users 和 Comment 实体
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private Users user;
    @Column(name = "rate", nullable = false)
    private double rate;
    @Column(name = "comment", nullable = false)
    private String comment;
    @Column(name = "commentDate", nullable = false)
    @JsonFormat(pattern =  "yyyy-mm-dd hh:mm:ss")
    private String commentDate;


    public long getCommentId() {
        return commentId;
    }

    public void setCommentId(int commentId) {
        this.commentId = commentId;
    }

    public long getRequestId() {
        return requestId;
    }

    public void setRequestId(int requestId) {
        this.requestId = requestId;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
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
