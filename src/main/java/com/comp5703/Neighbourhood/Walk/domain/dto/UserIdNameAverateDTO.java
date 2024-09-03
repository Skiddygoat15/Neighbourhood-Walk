package com.comp5703.Neighbourhood.Walk.domain.dto;

public class UserIdNameAverateDTO {

    private final long userId;
    private final String name;
    private final Double rate;


    public UserIdNameAverateDTO(long userId, String name, Double rate) {
        this.userId = userId;
        this.name = name;
        this.rate = rate;
    }

    public Double getRate() {
        return rate;
    }

    public long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }
}
