package com.comp5703.Neighbourhood.Walk.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserProfileDTO {

    private String name;
    private String surname;
    private String email;
    private String phone;
    private String address;
    private Date birthDate;
    private String preferredName;
    private String gender;
    private String profImgUrl;
    private String communicatePref;
    private List<Date> availableDate;
    private List<String> skill;
    private boolean verified;
}
