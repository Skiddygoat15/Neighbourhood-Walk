package com.comp5703.Neighbourhood.Walk.Entities;

public class RoleDTO {
    private int roleId;
    private String roleType;
    private long userId;
    private String phone;
    private String email;
    private String name;
    private String surName;

    // 构造方法
    public RoleDTO(int roleId, String roleType, long userId, String phone, String email, String name, String surName) {
        this.roleId = roleId;
        this.roleType = roleType;
        this.userId = userId;
        this.phone = phone;
        this.email = email;
        this.name = name;
        this.surName = surName;
    }

    // Getter 和 Setter
    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurName() {
        return surName;
    }

    public void setSurName(String surName) {
        this.surName = surName;
    }
}
