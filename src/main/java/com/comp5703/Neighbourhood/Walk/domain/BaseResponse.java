package com.comp5703.Neighbourhood.Walk.domain;

import java.io.Serializable;

//Response Result Wrapper Object
public class BaseResponse<T> implements Serializable {

    private static final long serialVersionUID = 1901152752394073986L;

//    response status code
    private String code;

    //    Response Result Description
    private String message;

//    Data returned
    private T data;

//    Successful return, returns a paradigm
    public static <T> BaseResponse<T> success(T data){
        BaseResponse<T> response = new BaseResponse<>();
        response.setCode(ResultCode.SUCCESS.getCode());
        response.setMessage(ResultCode.SUCCESS.getMessage());
        response.setData(data);
        return response;
    }
//    Failure to return
    public static <T> BaseResponse<T> fail(String message){
        BaseResponse<T> response = new BaseResponse<>();
        response.setCode(ResultCode.ERROR.getCode());
        response.setMessage(message);
        return response;
    }
//    Failure to return to overloading
    public static <T> BaseResponse<T> fail(String code, String message){
        BaseResponse<T> response = new BaseResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
