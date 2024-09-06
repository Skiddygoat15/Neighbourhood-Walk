package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import com.comp5703.Neighbourhood.Walk.Service.Specification.RequestSpecifications;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        // search parent, walker instance manually
        System.out.println("Parent ID: " + request.getParent().getId());
        Users parent = usersRepository.findById(request.getParent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + request.getParent().getId()));

//        Users walker = usersRepository.findById(request.getWalker().getId())
//                .orElseThrow(() -> new ResourceNotFoundException("Walker not found with id: " + request.getWalker().getId()));

        // set the mapping object
        request.setParent(parent);
        // request.setWalker(walker);
        request.setStatus("Published");
        return requestRepository.save(request);
    }

    //todo: after accept a walker, parent should not be able to update the request in progress
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
    public WalkerRequest applyRequest(int requestId, int walkerId) {
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
    public List<Request> searchRequests(String searchTerm, Date startTime, Date arriveTime) {
        // Combine Specifications
        Specification<Request> spec = Specification.where(RequestSpecifications.statusIs("Published"))
                .and(RequestSpecifications.hasDeparture(searchTerm)
                    .or(RequestSpecifications.hasDestination(searchTerm))
                    .or(RequestSpecifications.hasUserNameOrSurname(searchTerm)));

        // Add optional filters based on time if provided
        if (startTime != null) {
            spec = spec.and(RequestSpecifications.hasStartTime(startTime));
        }
        if (arriveTime != null) {
            spec = spec.and(RequestSpecifications.hasArriveTime(arriveTime));
        }

        List<Request> requests = requestRepository.findAll(spec);
        // check if request exists
        if (requests.isEmpty()) {
            throw new ResourceNotFoundException("No matching requests found for the given search criteria.");
        }

        return requests;
    }

    @Override
    public Request getById(int requestId) {
        return requestRepository.getById(requestId);
    }

}
