package com.comp5703.Neighbourhood.Walk.domain.dto;

public class RateCommentDTO {
    private final Double rate;
    private final String comment;

    public RateCommentDTO(Double rate, String comment) {
        this.rate = rate;
        this.comment = comment;
    }

    public Double getRate() {
        return rate;
    }

    public String getComment() {
        return comment;
    }
}
