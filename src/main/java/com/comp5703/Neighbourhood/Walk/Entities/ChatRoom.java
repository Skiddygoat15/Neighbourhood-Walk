package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ChatRoom")
public class ChatRoom {

    @Id
    @JoinColumn(name = "ChatRoomId")
    private String id;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "ChatBoxes")
    private List<ChatBox> ChatBoxes = new ArrayList<>();

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "roleFrom")
    @JsonIgnore
    private Role roleFrom;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "roleTo")
    @JsonIgnore
    private Role roleTo;

    public ChatRoom() {}

    public ChatRoom(String id, List<ChatBox> chatBoxes, Role roleFrom, Role roleTo) {
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
