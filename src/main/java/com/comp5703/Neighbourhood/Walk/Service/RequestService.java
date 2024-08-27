package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;

public interface RequestService {
    Request createRequest(Request request);
    Request updateRequest(int requestId, Request updatedRequest);
    void cancelRequest(int requestId);
    WalkerRequest acceptWalkerRequest(int requestId, int walkerId);
    WalkerRequest rejectWalkerRequest(int requestId, int walkerId);
    void deleteRequest(int requestId);
}
