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

    @OneToOne
    @JoinColumn(name = "requestId")
    private Request request;

    @ManyToOne
    @JoinColumn(name = "userId")
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

    public void setCommentId(long commentId) {
        this.commentId = commentId;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
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
