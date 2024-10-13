package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.RequestDTO;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;

import java.util.Date;
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
    RequestDTO getRequestById(int requestId);
    public List<RequestDTO> getAllRequests();

    WalkerRequest applyRequest(int requestId, long walkerId);


    // byron
    double calculateDistance(double lat1, double lon1, double lat2, double lon2);
    List<Request> searchRequests(Long walkerId, String searchTerm, String distance, Date startTime, Date arriveTime);
    Request getById(int requestId);

    //admin statistics
    long getTotalRequests();
    long getRequestsByStatus(String status);
}
