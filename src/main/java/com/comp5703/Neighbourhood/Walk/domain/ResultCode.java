package com.comp5703.Neighbourhood.Walk.domain;

//Response Status Code Enumeration Class
public enum ResultCode {
    SUCCESS("200","The operation was successful."),
    ERROR("500","failure of an operation");

    private String code;
    private String message;


    ResultCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
