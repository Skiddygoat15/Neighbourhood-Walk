package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.*;
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

import java.util.*;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;


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
    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<Request> getRequestsByUserId(Long userId) {
        List<Request> requests = requestRepository.findByParentId(userId);
        return requests;
    }

    @Override
    public List<Request> getRequestsByWalkerId(Long userId) {
        List<Request> requests = requestRepository.findByWalkerId(userId);
        return requests;
    }
    @Override
    public Users getWalkerByRequestId(int requestId){
        return requestRepository.findWalkerByRequestId(requestId);
    }

    @Override
    public Users getParentByRequestId(int requestId){
        return requestRepository.findParentByRequestId(requestId);
    }

    @Override
    public List<RequestDTO> getAllRequests() {
        // List<Request> requests = requestRepository.findAll();
        List<Request> requests = requestRepository.findAll();

        // Convert each Request to RequestDTO
        List<RequestDTO> requestDTOs = requests.stream().map(request -> new RequestDTO(
                request.getRequestId(),
                request.getWalker(),
                request.getParent(),
                request.getPublishDate(),
                request.getStartTime(),
                request.getArriveTime(),
                request.getDeparture(),
                request.getDestination(),
                request.getDetails(),
                request.getStatus()
        )).collect(Collectors.toList());

        return requestDTOs;
    }

    @Override
    public RequestDTO getRequestById(int requestId) {
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        // Convert Request to RequestDTO
        RequestDTO requestDTO = new RequestDTO(
                request.getRequestId(),
                request.getWalker(),
                request.getParent(),
                request.getPublishDate(),
                request.getStartTime(),
                request.getArriveTime(),
                request.getDeparture(),
                request.getDestination(),
                request.getDetails(),
                request.getStatus()
        );

        return requestDTO;
    }

    @Override
    public RequestLiveLocationDTO getLiveLocationByRequestId(int requestId) {
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        // Convert Request to RequestDTO
        RequestLiveLocationDTO requestLiveLocation = new RequestLiveLocationDTO(
                request.getRequestId(),
                request.getWalker(),
                request.getParent(),
                request.getStartTime(),
                request.getArriveTime(),
                request.getStatus(),
                request.getDeparture(),
                request.getDepartureLatitude(),
                request.getDepartureLongitude(),
                request.getDestination(),
                request.getDestinationLatitude(),
                request.getDestinationLongitude(),
                request.getParentLatitude(),
                request.getParentLongitude(),
                request.getWalkerLatitude(),
                request.getWalkerLongitude()
        );

        return requestLiveLocation;
    }

    @Override
    public Request createRequest(Request request) {
        // Make sure departure and destination are not empty
        if (request.getDeparture() == null || request.getDeparture().isEmpty()) {
            throw new IllegalArgumentException("Departure cannot be null or empty.");
        }
        if (request.getDepartureLatitude() == null || request.getDepartureLatitude().isNaN() ||
                request.getDepartureLongitude() == null || request.getDepartureLongitude().isNaN()) {
            throw new IllegalArgumentException("Departure address is not valid.");
        }
        if (request.getDestination() == null || request.getDestination().isEmpty()) {
            throw new IllegalArgumentException("Destination cannot be null or empty.");
        }
        if (request.getDestinationLatitude() == null || request.getDestinationLatitude().isNaN() ||
                request.getDestinationLongitude() == null || request.getDestinationLongitude().isNaN()) {
            throw new IllegalArgumentException("Destination address is not valid.");
        }

        Date currentDate = new Date();
        // logic to validate start and end times
        if (request.getStartTime() == null || request.getArriveTime() == null || request.getStartTime().toString().contains("NaN") || request.getArriveTime().toString().contains("NaN")) {
            throw new IllegalArgumentException("Invalid time format. Please ensure all fields are filled correctly.");
        }

        if (request.getArriveTime().before(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after the start time.");
        }

        if (request.getStartTime().before(currentDate) || request.getArriveTime().before(currentDate)) {
            throw new IllegalArgumentException("Start time and end time must be in the future.");
        }

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

    @Override
    public Request updateRequest(int requestId, Request updatedRequest) {
        Date currentDate = new Date();
        // logic to validate start and end times

        if (updatedRequest.getStartTime().before(currentDate) || updatedRequest.getArriveTime().before(currentDate)) {
            throw new IllegalArgumentException("Start time and end time must be in the future.");
        }

//        Users parent = usersRepository.findById(updatedRequest.getParent().getId())
//                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + updatedRequest.getParent().getId()));
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        request.setStartTime(updatedRequest.getStartTime());
        request.setArriveTime(updatedRequest.getArriveTime());
        request.setDeparture(updatedRequest.getDeparture());
        request.setDepartureLatitude(updatedRequest.getDepartureLatitude());
        request.setDepartureLongitude(updatedRequest.getDepartureLongitude());
        request.setDestination(updatedRequest.getDestination());
        request.setDestinationLatitude(updatedRequest.getDestinationLatitude());
        request.setDestinationLongitude(updatedRequest.getDestinationLongitude());
        request.setDetails(updatedRequest.getDetails());

        return requestRepository.save(request);
    }

    @Override
    public Request updateLocation(int requestId, Double parentLatitude, Double parentLongitude, Double walkerLatitude, Double walkerLongitude) {

        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (parentLatitude != null) {
            request.setParentLatitude(parentLatitude);
        }
        if (parentLongitude != null) {
            request.setParentLongitude(parentLongitude);
        }
        if (walkerLatitude != null) {
            request.setWalkerLatitude(walkerLatitude);
        }
        if (walkerLongitude != null) {
            request.setWalkerLongitude(walkerLongitude);
        }

        return requestRepository.save(request);
    }

    @Override
    public void cancelRequest(int requestId) {
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        request.setStatus("Canceled");
        requestRepository.save(request);
    }

    @Override
    public void completeRequest(int requestId, long walkerId) {
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        Optional<WalkerRequest> walkerRequestOpt = walkerRequestRepository.findByRequestRequestIdAndWalkerUserId(requestId, walkerId);
        // Update the status of the walkerRequest if it exists.
        if (walkerRequestOpt.isPresent()) {
            WalkerRequest walkerRequest = walkerRequestOpt.get();
            walkerRequest.setStatus("Completed");
            walkerRequestRepository.save(walkerRequest);
        } else {
            throw new ResourceNotFoundException("WalkerRequest not found for the given walker and request");
        }
        request.setStatus("Completed");
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
        if (Objects.equals(request.getStatus(), "Accepted")){
            throw new ResourceNotFoundException("The request has been accepted by anyone before.");
        }
        if (walkerRequest.getStatus().equals("Applied")){
            walkerRequest.setStatus("Accepted");
            walkerRequestRepository.save(walkerRequest);
        }
//        walkerRequest.setStatus("Accepted");
//        walkerRequest.setWalker(usersRepository.getById(walkerId));
//        walkerRequestRepository.save(walkerRequest);

        request.setStatus("Accepted");
        request.setWalker(usersRepository.getById(walkerId));
        requestRepository.save(request);


        // add a new notification
        System.out.println("Accept");
        Notification notification = notificationRepository.findAllByWalkerRequest_WalkerRequestId(walkerRequest.getWalkerRequestId());
        if (Objects.equals(notification.getStatusPrevious(), "Published") && Objects.equals(notification.getStatusChanged(), "Applied")){
            notification.setStatusChanged("Accepted");
            notification.setStatusPrevious("Applied");
            notification.setNotificationCheck(false);
            notification.setNotificationClose(false);
            notificationService.addNotification(notification);
        }else{
            notificationService.addNotification(new Notification(walkerRequest,previousStatus,"Accepted",false,false));
        }
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


        // add a new notification
        System.out.println("Reject");
        Notification notification = notificationRepository.findAllByWalkerRequest_WalkerRequestId(walkerRequest.getWalkerRequestId());
        if (Objects.equals(notification.getStatusPrevious(), "Published") && Objects.equals(notification.getStatusChanged(), "Applied")){
            notification.setStatusChanged("Rejected");
            notification.setStatusPrevious("Applied");
            notification.setNotificationCheck(false);
            notification.setNotificationClose(false);
            notificationService.addNotification(notification);
        }else{
            notificationService.addNotification(new Notification(walkerRequest,previousStatus,"Rejected",false,false));
        }
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
        walkerRequestRepository.save(walkerRequest);

        // add a new notification
        String previousStatus = request.getStatus();
        System.out.println("Apply");
        notificationService.addNotification(new Notification(walkerRequest,previousStatus,"Applied"));
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

        // add a new notification
        String previousStatus = request.getStatus();
        notificationService.addNotification(new Notification(walkerRequest,previousStatus,"Cancelled"));
    }

    @Override
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // The radius of the earth in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c; // Return distance in kilometers
        return distance;
    }

    @Override
    public List<Request> searchRequests(Long walkerId, String searchTerm, String distance, Date startTime, Date arriveTime) {
        Specification<Request> spec = Specification.where(RequestSpecifications.statusIs("Published"));

        // Check whether the search term is empty or contains only Spaces
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            // If the search condition is empty, all requests are returned
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

        List<Request> requests = requestRepository.findAll(spec);
        // check if request exists
        if (requests.isEmpty()) {
            throw new ResourceNotFoundException("No requests found for the given search criteria.");
        }

        Users currentWalker = usersRepository.findById(walkerId)
                .orElseThrow(() -> new ResourceNotFoundException("User Information not found"));
        double walkerLatitude = currentWalker.getLatitude();
        double walkerLongitude = currentWalker.getLongitude();

        // Distance filter
        if (distance != null && !distance.isEmpty()) {
            double maxDistanceKm = distance.equals("1km") ? 1 : 2;

            // Calculate distance using Haversine formula and filter
            requests = requests.stream()
                    .filter(request -> {
                        // Check if there is the latitude and longitude of the starting point
                        Double requestLatitude = request.getDepartureLatitude();
                        Double requestLongitude = request.getDepartureLongitude();

                        // If the latitude and longitude of the starting point is empty, skip this request
                        if (requestLatitude == null || requestLongitude == null) {
                            return false; // Filter this request
                        }

                        // Calculate the distance between two latitude and longitude
                        double calculatedDistance = calculateDistance(walkerLatitude, walkerLongitude, requestLatitude, requestLongitude);

                        // Only keep requests that are within distance
                        return calculatedDistance <= maxDistanceKm;
                    })
                    .collect(Collectors.toList());
        }

        // check whether request list is empty after filtering
        if (requests.isEmpty()) {
            throw new ResourceNotFoundException("No requests found for the given distance constraint.");
        }

        return requests;
    }

    @Override
    public Request getById(int requestId) {
        return requestRepository.getById(requestId);
    }

    public long getTotalRequests() {
        return requestRepository.count();
    }

    public long getRequestsByStatus(String status) {
        return requestRepository.countByStatus(status);
    }

}
