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
@Table(name = "ChatBox")
public class ChatBox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn(name = "ChatBoxId")
    private long id;

    @ManyToOne
    @JoinColumn(name = "roleFrom")
    @JsonIgnore
    private Role roleFrom;

    @ManyToOne
    @JoinColumn(name = "roleTo")
    @JsonIgnore
    private Role roleTo;

    @Column(name = "message")
    private String message;

    @Column(name = "time")
    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timezone = "UTC")
    @TableField(fill = FieldFill.INSERT) //标明该字段，在什么时候需要被填充
    private Date time;

    @ManyToOne
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;


    @Override
    public String toString() {
        return "ChatBox{" +
                "id=" + id +
                ", roleFrom=" + roleFrom +
                ", roleTo=" + roleTo +
                ", message='" + message + '\'' +
                ", time=" + time +
                ", chatRoom=" + chatRoom +
                '}';
    }

    public ChatBox() {
    }

    public ChatBox(Role roleFrom, Role roleTo, String message, ChatRoom chatRoom) {
        this.roleFrom = roleFrom;
        this.roleTo = roleTo;
        this.message = message;
        this.chatRoom = chatRoom;
    }

    public ChatBox(Role roleFrom, Role roleTo, String message, Date time, ChatRoom chatRoom) {
        this.roleFrom = roleFrom;
        this.roleTo = roleTo;
        this.message = message;
        this.time = time;
        this.chatRoom = chatRoom;
    }

    public ChatBox(long id, Role roleFrom, Role roleTo, String message, ChatRoom chatRoom) {
        this.id = id;
        this.roleFrom = roleFrom;
        this.roleTo = roleTo;
        this.message = message;
        this.chatRoom = chatRoom;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Role getRoleFrom() {
        return roleFrom;
    }

    public void setRoleFrom(Role roleFrom) {
        this.roleFrom = roleFrom;
    }

    public Role getRoleTo() {
        return roleTo;
    }

    public void setRoleTo(Role roleTo) {
        this.roleTo = roleTo;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public ChatRoom getChatRoom() {
        return chatRoom;
    }

    public void setChatRoom(ChatRoom chatRoom) {
        this.chatRoom = chatRoom;
    }
}
