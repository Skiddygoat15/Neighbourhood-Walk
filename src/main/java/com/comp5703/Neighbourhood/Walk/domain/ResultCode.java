package com.comp5703.Neighbourhood.Walk.domain;

//响应状态码枚举类
public enum ResultCode {
    SUCCESS("200","操作成功"),
    ERROR("500","操作失败");

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
