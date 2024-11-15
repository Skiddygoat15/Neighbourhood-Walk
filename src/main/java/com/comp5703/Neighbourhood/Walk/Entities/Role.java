package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "Role")  // Corresponds to the table name in the database
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roleId")
    private long roleId;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
    @JsonIgnore  // This field is ignored in the JSON output
    private Users userId;

    @Column(name = "roleType", nullable = false)
    private String roleType;

    @Override
    public String toString() {
        return "Role{" +
                "roleId=" + roleId +
                ", userId=" + userId +
                ", roleType='" + roleType + '\'' +
                '}';
    }

    // Constructors
    public Role() {}

    public Role(Users user, String roleType) {
        this.userId = user;
        this.roleType = roleType;
    }

    // Getters and Setters
    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }

    public Users getUser() {
        return userId;
    }

    public void setUser(Users user) {
        this.userId = user;
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }
}

