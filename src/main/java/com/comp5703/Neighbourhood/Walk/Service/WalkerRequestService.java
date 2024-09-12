package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;

public interface WalkerRequestService {
    WalkerRequest getWalkerRequest(long walkerId);
    Request getRequest(long walkerRequestId);
}
