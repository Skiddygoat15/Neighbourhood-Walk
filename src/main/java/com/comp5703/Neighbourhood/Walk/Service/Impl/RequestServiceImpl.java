package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Notification;
import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.NotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import com.comp5703.Neighbourhood.Walk.Service.Specification.RequestSpecifications;
import com.comp5703.Neighbourhood.Walk.Service.Specification.UsersSpecifications;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
public class RequestServiceImpl implements RequestService {

    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private WalkerRequestRepository walkerRequestRepository;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private NotificationServiceImpl notificationService;

    @Override
    public List<Request> getRequestsByUserId(Long userId) {
        List<Request> requests = requestRepository.findByParentId(userId);
//        if (requests.isEmpty()) {
//            // 可以选择返回一个自定义的异常，或者在控制器里处理
//            throw new ResourceNotFoundException("No requests found for userId: " + userId);
//        }
        return requests;
    }

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
        Users parent = usersRepository.findById(updatedRequest.getParent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + updatedRequest.getParent().getId()));
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        request.setStartTime(updatedRequest.getStartTime());
        request.setArriveTime(updatedRequest.getArriveTime());
        request.setDeparture(updatedRequest.getDeparture());
        request.setDestination(updatedRequest.getDestination());
        request.setDetails(updatedRequest.getDetails());
        request.setStatus(updatedRequest.getStatus());
        request.setParent(parent);

        return requestRepository.save(request);

    }

    @Override
    public void cancelRequest(int requestId) {
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        request.setStatus("Canceled");
        requestRepository.save(request);
    }

    @Override
    public WalkerRequest  acceptWalkerRequest(int requestId, long walkerId) {
        WalkerRequest walkerRequest = walkerRequestRepository.findByRequestRequestIdAndWalkerUserId(requestId, walkerId)
                .orElseThrow(() -> new ResourceNotFoundException("Walker request not found for this walker with id: " + walkerId));
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        String previousStatus = walkerRequest.getStatus();
        if (Objects.equals(walkerRequest.getStatus(), "Accepted")){
            throw new ResourceNotFoundException("The parent has already accepted the request before.");
        }

        request.setStatus("Accepted");
        request.setWalker(usersRepository.getById(walkerId));
        requestRepository.save(request);

        // update walkerRequest's status
        walkerRequest.setStatus("Accepted");
        walkerRequestRepository.save(walkerRequest);

        // add a new notification
        notificationService.addNotification(new Notification(walkerRequest,previousStatus,"Accepted"));
        return walkerRequest;
    }

    @Override
    public WalkerRequest rejectWalkerRequest(int requestId, long walkerId) {
        WalkerRequest walkerRequest = walkerRequestRepository.findByRequestRequestIdAndWalkerUserId(requestId, walkerId)
                .orElseThrow(() -> new ResourceNotFoundException("Walker request not found for this walker with id: " + walkerId));

        Request request = requestRepository.findById(requestId)
            .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        String previousStatus = walkerRequest.getStatus();
        if (Objects.equals(walkerRequest.getStatus(), "Rejected")){
            throw new ResourceNotFoundException("The parent has already rejected the request before.");
        }

        // update walkerRequest's status
        walkerRequest.setStatus("Rejected");
        walkerRequestRepository.save(walkerRequest);

        if (Objects.equals(request.getStatus(), "Accepted") && request.getWalker().getId() == walkerId){
            request.setStatus("Rejected");
            requestRepository.save(request);
        }

        // add a new notification
        notificationService.addNotification(new Notification(walkerRequest,previousStatus,"Rejected"));
        return walkerRequest;
    }

    @Override
    public void deleteRequest(int requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));
        requestRepository.delete(request);
    }


    @Override
    public WalkerRequest applyRequest(int requestId, long walkerId) {
        // check if request exists
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));
        // same the current walkerRequest
        Optional<WalkerRequest> existingWalkerRequest = walkerRequestRepository.findByRequestRequestIdAndWalkerUserId(requestId, walkerId);
        if (existingWalkerRequest.isPresent()) {
            WalkerRequest walkerRequest = existingWalkerRequest.get();
            // check the existing walkerRequest status and decide whether to apply again or cancel
            if (walkerRequest.getStatus().equals("Applied") || walkerRequest.getStatus().equals("Accepted")) {
                throw new IllegalStateException("you have already applied for this request."); // cancel this apply
            } else if (walkerRequest.getStatus().equals("Rejected") || walkerRequest.getStatus().equals("Cancelled")) {
                walkerRequest.setStatus("Applied");
                return walkerRequestRepository.save(walkerRequest);
            }
        }
        // if the same walkerRequest not exist, then create new WalkerRequest
        WalkerRequest walkerRequest = new WalkerRequest();
        walkerRequest.setRequest(requestRepository.getById(requestId));
        walkerRequest.setWalker(usersRepository.getById(walkerId));
        walkerRequest.setStatus("Applied");
        return walkerRequestRepository.save(walkerRequest);
    }

    @Override
    public void cancelApply(int requestId, long walkerId) {
        // check if walker have ever applied this request
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("You haven't applied for Request with id: " + requestId));

        WalkerRequest walkerRequest = walkerRequestRepository.findByRequestRequestIdAndWalkerUserId(requestId, walkerId)
                .orElseThrow(() -> new ResourceNotFoundException("No WalkerRequest found for walkerId: " + walkerId + " and requestId: " + requestId));

        // delete the apply record
        // walkerRequestRepository.delete(walkerRequest);
        //set cancelled status can store the apply history
        walkerRequest.setStatus("Cancelled");
        walkerRequestRepository.save(walkerRequest);
    }


    @Override
    public List<Request> searchRequests(String searchTerm, String distance, Date startTime, Date arriveTime) {
        Specification<Request> spec = Specification.where(RequestSpecifications.statusIs("Published"))
                .or(RequestSpecifications.statusIs("Applied"));

        // 检查 searchTerm 是否为空或仅包含空格
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            // 如果搜索条件为空，则返回所有 requests
        } else {
            // Combine Specifications
            spec = spec.and(RequestSpecifications.hasDeparture(searchTerm)
                    .or(RequestSpecifications.hasDestination(searchTerm))
                    .or(RequestSpecifications.hasUserNameOrSurname(searchTerm)));
        }
        // Add optional filters based on time if provided
        if (startTime != null) {
            spec = spec.and(RequestSpecifications.hasStartTime(startTime));
        }
        if (arriveTime != null) {
            spec = spec.and(RequestSpecifications.hasArriveTime(arriveTime));
        }
//        if (distance != null && !distance.isEmpty()) {
//            spec = spec.and(UsersSpecifications.containsAttribute("distance", distance));
//        }

        List<Request> requests = requestRepository.findAll(spec);
        // check if request exists
        if (requests.isEmpty()) {
            throw new ResourceNotFoundException("No requests found for the given search criteria.");
        }

        return requests;
    }

    @Override
    public Request getById(int requestId) {
        return requestRepository.getById(requestId);
    }

}
