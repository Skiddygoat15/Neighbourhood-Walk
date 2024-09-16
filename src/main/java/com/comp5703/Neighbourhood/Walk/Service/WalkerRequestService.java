package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;

import java.util.List;


public interface WalkerRequestService {
    List<WalkerRequest> getWalkerRequestByWalkerId(long walkerId);
    Request getRequest(long walkerRequestId);
    List<Users> getWalkersByRequestId(int requestId);
    List<Request> getRequestsByWalkerId(long walkerId);
    Users getParentIdByWalkerRequestId(long walkerRequestId);
}
