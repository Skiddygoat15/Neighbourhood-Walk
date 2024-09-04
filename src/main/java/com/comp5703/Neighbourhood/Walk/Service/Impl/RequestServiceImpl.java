package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;


@Service
public class RequestServiceImpl implements RequestService {

    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private WalkerRequestRepository walkerRequestRepository;
    @Autowired
    private UsersRepository usersRepository;


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
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

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
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));
        requestRepository.delete(request);
    }

    @Override
    public WalkerRequest applyRequest(int walkerId, int requestId) {
        // check if request exists
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        // create and save WalkerRequest
        WalkerRequest walkerRequest = new WalkerRequest();
        walkerRequest.setRequestId(requestId);
        walkerRequest.setWalkerId(walkerId);
        walkerRequest.setStatus("Applied");
        return walkerRequestRepository.save(walkerRequest);
    }

    @Override
    public void cancelApply(int walkerRequestId) {
        // check if request exists
        WalkerRequest walkerRequest = walkerRequestRepository.findById(walkerRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("WalkerRequest not found with id: " + walkerRequestId));

        // delete the apply record
        walkerRequestRepository.delete(walkerRequest);
    }


    @Override
    public List<Request> searchRequests(String search) {
        return requestRepository.searchRequests(search);
    }

}
