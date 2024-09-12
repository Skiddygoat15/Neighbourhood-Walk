package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;

import java.sql.Date;
import java.util.List;
//import java.util.Date;


public interface RequestService {
    List<Request> getRequestsByUserId(Long userId);
    Request createRequest(Request request);
    Request updateRequest(int requestId, Request updatedRequest);
    void cancelRequest(int requestId);
    WalkerRequest acceptWalkerRequest(int requestId, long walkerId);
    WalkerRequest rejectWalkerRequest(int requestId, long walkerId);
    void deleteRequest(int requestId);
    void cancelApply(int requestId, long walkerId);

    WalkerRequest applyRequest(int requestId, long walkerId);


    // byron
    List<Request> searchRequests(String searchTerm, Date startTime, Date arriveTime);
    Request getById(int requestId);
}
