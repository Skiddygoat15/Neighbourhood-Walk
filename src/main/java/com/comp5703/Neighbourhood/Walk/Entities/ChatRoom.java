package com.comp5703.Neighbourhood.Walk.Entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ChatRoom")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn(name = "ChatRoomId")
    private long id;

    @OneToMany
    @JoinColumn(name = "ChatBoxes")
    private List<ChatBox> ChatBoxes = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "roleFrom")
    private Role roleFrom;

    @ManyToOne
    @JoinColumn(name = "roleTo")
    private Role roleTo;

    public ChatRoom() {
    }

    public ChatRoom(long id, List<ChatBox> chatBoxes, Role roleFrom, Role roleTo) {
        this.id = id;
        ChatBoxes = chatBoxes;
        this.roleFrom = roleFrom;
        this.roleTo = roleTo;
    }

    public ChatRoom(List<ChatBox> chatBoxes, Role roleFrom, Role roleTo) {
        ChatBoxes = chatBoxes;
        this.roleFrom = roleFrom;
        this.roleTo = roleTo;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public List<ChatBox> getChatBoxes() {
        return ChatBoxes;
    }

    public void setChatBoxes(List<ChatBox> chatBoxes) {
        ChatBoxes = chatBoxes;
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
}
