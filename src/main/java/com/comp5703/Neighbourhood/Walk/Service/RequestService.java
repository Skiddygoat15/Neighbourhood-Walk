package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Request;

public interface RequestService {
    Request createRequest(Request request);
    Request updateRequest(int requestId, Request updatedRequest);
    void cancelRequest(int requestId);
    Request acceptRequest(int requestId, int walkerId);
    Request rejectRequest(int requestId, int walkerId);
    void deleteRequest(int requestId);
}
