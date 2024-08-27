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
    private int userId;
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

    public int getId() {
        return userId;
    }

    public void setId(int id) {
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
    public List<String> getSkill() {
        return skill;
    }

}
