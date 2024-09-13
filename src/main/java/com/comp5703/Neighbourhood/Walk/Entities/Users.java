package com.comp5703.Neighbourhood.Walk.Entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "Users")

public class Users {
    // primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    private long userId;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "surname", nullable = false)
    private String surname;
    @Column(name = "email", nullable = false)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "phone", nullable = false)
    private String phone;
    @Column(name = "address", nullable = false)
    private String address;
    @Column(name = "birth_date")
    private Date birthDate;
    @Column(name = "preferred_name")
    private String preferredName;
    @Column(name = "gender")
    private String gender;
    @Column(name = "profile_img_url")
    private String profImgUrl;
    @Column(name = "communication_preference")
    private String communicatePref;
    @ElementCollection
    @CollectionTable(name = "available_dates", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "available_date")
    private List<Date> availableDate;  // 使用List接口
    @ElementCollection
    @CollectionTable(name = "skills", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "skill")
    private List<String> skill;
    @Column(name = "verified")
    private boolean verified;
    @Column(name = "verify_method")
    private String veriMethod;
    @Column(name = "avgUserRating")
    private double avgUserRating;
    /*
    @OneToMany(mappedBy = "userId")：表示 Users 和 Role 之间是一对多的关系。
    mappedBy 指定了在 Role 实体中定义了关系的字段，即 userId。
    cascade = CascadeType.ALL：表示当对 Users 实体进行持久化操作时，关联的 Role 实体也会同步进行相应的操作（例如保存、更新、删除）。
    orphanRemoval = true：当从 roles 集合中删除一个 Role 实体时，数据库中对应的记录也会被删除。
     */
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Role> roles = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Request> Requests_parentId = new ArrayList<>();

    @OneToMany(mappedBy = "walker", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Request> Requests_walkerId = new ArrayList<>();

    @OneToMany(mappedBy = "walkerRequestId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WalkerRequest> walkerRequestId = new ArrayList<>();

    public Users() {
    }

    public Users(long userId) {
        this.userId = userId;
    }

    public long getId() {
        return userId;
    }

    public void setId(long id) {
        this.userId = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }
    public String getPreferredName() {
        return preferredName;
    }
    public void setPreferredName(String preferredName) {
        this.preferredName = preferredName;
    }
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public String getProfImgUrl() {
        return profImgUrl;
    }
    public void setProfImgUrl(String profImgUrl) {
        this.profImgUrl = profImgUrl;
    }
    public String getCommunicatePref() {
        return communicatePref;
    }
    public void setCommunicatePref(String communicatePref) {
        this.communicatePref = communicatePref;
    }
    public List<Date> getAvailableDate() {
        return availableDate;
    }
    public void setAvailableDate(List<Date> availableDate) {
        this.availableDate = availableDate;
    }
    public void setSkill(List<String> skill) {
        this.skill = skill;
    }
    public List<String> getSkill() {
        return skill;
    }
    public void setVerified(boolean verified) {
        this.verified = verified;
    }
    public boolean isVerified() {
        return verified;
    }
    public void setVeriMethod(String veriMethod) {
        this.veriMethod = veriMethod;
    }
    public String getVeriMethod() {
        return veriMethod;
    }
    public void setAvgUserRating(double avgUserRating) {
        this.avgUserRating = avgUserRating;
    }
    public double getAvgUserRating() {
        return avgUserRating;
    }

    public List<Comment> getComments() {
        return comments;
    }
    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

}
