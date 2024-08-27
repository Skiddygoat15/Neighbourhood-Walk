package com.comp5703.Neighbourhood.Walk.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Role")  // 对应数据库中的表名
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roleId")
    private int roleId;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
    private Users userId;

    @Column(name = "roleType", nullable = false)
    private String roleType;

    // Constructors
    public Role() {}

    public Role(Users user, String roleType) {
        this.userId = user;
        this.roleType = roleType;
    }

    // Getters and Setters
    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
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

