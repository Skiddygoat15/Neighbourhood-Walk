package com.comp5703.Neighbourhood.Walk.Entities;
import jakarta.persistence.*;


@Entity
@Table(name = "ChatBox")
public class ChatBox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn(name = "ChatBoxId")
    private long id;

    @JoinColumn(name = "roleFrom")
    private long roleFrom;
    @JoinColumn(name = "roleTo")
    private long roleTo;

    @JoinColumn(name = "message")
    private String message;

    public ChatBox() {
    }

    public ChatBox(long id, long roleFrom, long roleTo, String message) {
        this.id = id;
        this.roleFrom = roleFrom;
        this.roleTo = roleTo;
        this.message = message;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getRoleFrom() {
        return roleFrom;
    }

    public void setRoleFrom(long roleFrom) {
        this.roleFrom = roleFrom;
    }

    public long getRoleTo() {
        return roleTo;
    }

    public void setRoleTo(long roleTo) {
        this.roleTo = roleTo;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
