package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import org.springframework.stereotype.Service;


@Service
public class RequestServiceImpl implements RequestService {


    @Override
    public Request createRequest(Request request) {
        return null;
    }

    @Override
    public Request updateRequest(int requestId, Request updatedRequest) {
        return null;
    }

    @Override
    public void cancelRequest(int requestId) {

    }

    @Override
    public Request acceptRequest(int requestId, int walkerId) {
        return null;
    }

    @Override
    public Request rejectRequest(int requestId, int walkerId) {
        return null;
    }
}
