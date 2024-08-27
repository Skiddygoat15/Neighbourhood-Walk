package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RequestServiceImpl implements RequestService {

    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private WalkerRequestRepository walkerRequestRepository;


    @Override
    public Request createRequest(Request request) {
        request.setStatus("Published");
        return requestRepository.save(request);
    }

    @Override
    public Request updateRequest(int requestId, Request updatedRequest) {
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        request.setStartTime(updatedRequest.getStartTime());
        request.setArriveTime(updatedRequest.getArriveTime());
        request.setDeparture(updatedRequest.getDeparture());
        request.setDestination(updatedRequest.getDestination());
        request.setDetails(updatedRequest.getDetails());
        request.setStatus(updatedRequest.getStatus());

        return requestRepository.save(request);

    }

    @Override
    public void cancelRequest(int requestId) {
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        request.setStatus("Canceled");
        requestRepository.save(request);
    }

    @Override
    public WalkerRequest  acceptWalkerRequest(int requestId, int walkerId) {
        WalkerRequest walkerRequest = walkerRequestRepository.findByRequestIdAndWalkerId(requestId, walkerId)
                .orElseThrow(() -> new ResourceNotFoundException("Walker request not found for this walker with id: " + walkerId));

        // update walkerRequest's status
        walkerRequest.setStatus("Accepted");
        walkerRequestRepository.save(walkerRequest);

        // update the Request's status
        Request request = walkerRequest.getRequest();
        request.setStatus("InProgress");
        requestRepository.save(request);

        return walkerRequest;
    }

    @Override
    public WalkerRequest rejectWalkerRequest(int requestId, int walkerId) {
        WalkerRequest walkerRequest = walkerRequestRepository.findByRequestIdAndWalkerId(requestId, walkerId)
                .orElseThrow(() -> new ResourceNotFoundException("Walker request not found for this walker with id: " + walkerId));

        // update walkerRequest's status
        walkerRequest.setStatus("Rejected");
        walkerRequestRepository.save(walkerRequest);

        return walkerRequest;
    }

    @Override
    public void deleteRequest(int requestId) {
        requestRepository.deleteById(requestId);
        return;
    }
}
