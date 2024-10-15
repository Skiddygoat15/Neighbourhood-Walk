package com.comp5703.Neighbourhood.Walk.Entities;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "ChatBar")
public class ChatBar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn(name = "ChatBarId")
    private long id;

    @ManyToOne
    @JoinColumn(name = "userFrom")
//    @JsonIgnore
    private Users userFrom;

    @ManyToOne
    @JoinColumn(name = "userTo")
//    @JsonIgnore
    private Users userTo;

    @JoinColumn(name = "state")
    private String state;

    @Override
    public String toString() {
        return "ChatBar{" +
                "id=" + id +
                ", userFrom=" + userFrom +
                ", userTo=" + userTo +
                ", state='" + state + '\'' +
                '}';
    }

    public ChatBar() {
    }

    public ChatBar(Users userFrom, Users userTo) {
        this.userFrom = userFrom;
        this.userTo = userTo;
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Users getUserFrom() {
        return userFrom;
    }

    public void setUserFrom(Users userFrom) {
        this.userFrom = userFrom;
    }

    public Users getUserTo() {
        return userTo;
    }

    public void setUserTo(Users userTo) {
        this.userTo = userTo;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}


