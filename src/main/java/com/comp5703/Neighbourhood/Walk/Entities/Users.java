package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
//    @Column(name = "full_address", nullable = false)
//    private String fullAddress;
    @Column(name = "latitude")
    private Double latitude;
    @Column(name = "longitude")
    private Double longitude;
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
    @Column(name = "activityStatus")
    private String activityStatus;
    @Column(name = "profileCompleted")
    private Boolean profileCompleted = false; // 默认为 false
    /*
    @OneToMany(mappedBy = "userId")：Indicates a one-to-many relationship between Users and Role.
    mappedBy Specifies the field that defines the relationship in the Role entity, userId.
    cascade = CascadeType.ALL：Indicates that when a persistence operation is performed on a Users entity, the associated Role entity also performs the corresponding operation (e.g., save, update, delete) synchronously.
    orphanRemoval = true：When a Role entity is deleted from the roles collection, the corresponding record in the database is also deleted.
     */
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Role> roles = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Request> Requests_parentId = new ArrayList<>();

    @OneToMany(mappedBy = "walker", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Request> Requests_walkerId = new ArrayList<>();

    @OneToMany(mappedBy = "walkerRequestId", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonManagedReference
    private List<WalkerRequest> walkerRequestId = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserProfileNotification> userProfileNotifications = new ArrayList<>();

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PreMeet> preMeetsAsParent = new ArrayList<>();

    @OneToMany(mappedBy = "walker", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PreMeet> preMeetsAsWalker = new ArrayList<>();

    @Override
    public String toString() {
        return "Users{" +
                "userId=" + userId +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

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

    public boolean isProfileCompleted() {
        return profileCompleted;
    }

    public void setProfileCompleted(Boolean val) {
        this.profileCompleted = val;
    }

    //    public String getFullAddress() {
//        return fullAddress;
//    }
//
//    public void setFullAddress(String fullAddress) {
//        this.fullAddress = fullAddress;
//    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) { this.longitude = longitude; }

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
    public String getActivityStatus() {
        return activityStatus;
    }

    public void setActivityStatus(String activityStatus) {
        this.activityStatus = activityStatus;
    }

}
