package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;

import java.util.List;
import java.util.Optional;


public interface WalkerRequestService {
    List<WalkerRequest> getWalkerRequestByWalkerId(long walkerId);
    Request getRequest(long walkerRequestId);
    List<Users> getWalkersByRequestId(int requestId);
    List<Request> getRequestsByWalkerId(long walkerId);

    Optional<?> getRequestDetailByRequestIdAndWalkerId(int requestId, long walkerId);
    Users getParentIdByWalkerRequestId(long walkerRequestId);
}
