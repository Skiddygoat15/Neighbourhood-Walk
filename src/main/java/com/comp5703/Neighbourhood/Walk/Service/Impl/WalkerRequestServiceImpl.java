package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.WalkerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class WalkerRequestServiceImpl implements WalkerRequestService {

    @Autowired
    private WalkerRequestRepository walkerRequestRepository;
    @Autowired
    private RequestRepository requestRepository;

    @Override
    public List<WalkerRequest> getWalkerRequestByWalkerId(long walkerId) {
        List<WalkerRequest> walkerRequestList = walkerRequestRepository.findByWalkerUserId(walkerId);
        if (walkerRequestList != null) {
            return walkerRequestList;
        }
        return null;
    }

    @Override
    public Request getRequest(long walkerRequestId) {
        return  walkerRequestRepository.findById(walkerRequestId).get().getRequest();
    }

    @Override
    public List<Users> getWalkersByRequestId(int requestId) {
        Users acceptedWalker = walkerRequestRepository.findAcceptedWalkerByRequestId(requestId);
        if (acceptedWalker != null) {
            return Collections.singletonList(acceptedWalker);
        }
        return walkerRequestRepository.findWalkersByRequestId(requestId);
    }

    @Override
    public List<Request> getRequestsByWalkerId(long walkerId) {
        return walkerRequestRepository.findRequestsByWalkerId(walkerId);
    }

    @Override
    public Optional<?> getRequestDetailByRequestIdAndWalkerId(int requestId, long walkerId) {
        Optional<WalkerRequest> walkerRequestOptional = walkerRequestRepository.findByRequestRequestIdAndWalkerUserId(requestId, walkerId);
        if (walkerRequestOptional.isEmpty()) {
            Optional<Request> requestOptional = requestRepository.findById(requestId);
            if (requestOptional.isPresent()) {
                return requestOptional;
            } else {
                throw new IllegalArgumentException("Request not found with id: " + requestId);
            }
        }
        return walkerRequestOptional;
    }

    public Users getParentIdByWalkerRequestId(long walkerRequestId) {
        Users parent = walkerRequestRepository.getById(walkerRequestId).getRequest().getParent();
        return parent;
    }

    public List<WalkerRequest> getWalkerRequestByRequestId(int requestId){
        return walkerRequestRepository.getByRequestRequestId(requestId);
    }
}
