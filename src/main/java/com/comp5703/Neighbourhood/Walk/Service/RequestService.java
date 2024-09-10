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
    WalkerRequest acceptWalkerRequest(int requestId, int walkerId);
    WalkerRequest rejectWalkerRequest(int requestId, int walkerId);
    void deleteRequest(int requestId);
    void cancelApply(int requestId, int walkerRequestId);

    WalkerRequest applyRequest(int walkerId, int requestId);


    // byron
    List<Request> searchRequests(String searchTerm, Date startTime, Date arriveTime);
    Request getById(int requestId);
}
