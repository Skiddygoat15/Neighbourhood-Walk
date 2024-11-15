package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.*;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * parent: addRequest => walker: AcceptRequest || RejectRequest => patent: applyRequest??
 */
@RestController
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;


    @GetMapping("/getRequestsByParentId/{parentId}")
    public ResponseEntity<List<Request>> getRequestsByParentId(@PathVariable Long parentId) {
        List<Request> requests = requestService.getRequestsByUserId(parentId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @GetMapping("/getRequestsByWalkerId/{walkerId}")
    public ResponseEntity<List<Request>> getRequestsByWalkerId(@PathVariable Long walkerId) {
        List<Request> requests = requestService.getRequestsByWalkerId(walkerId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @GetMapping("/getRequestByRequestId/{requestId}")
    public ResponseEntity<?> getRequestById(@PathVariable int requestId) {
        try {
            RequestDTO request = requestService.getRequestById(requestId);
            return new ResponseEntity<>(request, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getLiveLocationByRequestId/{requestId}")
    public ResponseEntity<?> getLiveLocationByRequestId(@PathVariable int requestId) {
        try {
            RequestLiveLocationDTO requestLiveLocation = requestService.getLiveLocationByRequestId(requestId);
            return new ResponseEntity<>(requestLiveLocation, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getWalkerByRequestId/{requestId}")
    public ResponseEntity<?> getWalkerByRequestId(@PathVariable int requestId) {
        try {
            Users user = requestService.getWalkerByRequestId(requestId);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (ResourceNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getParentByRequestId/{requestId}")
    public ResponseEntity<?> getParentByRequestId(@PathVariable int requestId) {
        try {
            Users user = requestService.getParentByRequestId(requestId);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (ResourceNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getAllRequests")
    public ResponseEntity<?> getAllRequests() {
        try {
            List<RequestDTO> request = requestService.getAllRequests();
            return new ResponseEntity<>(request, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping
    public ResponseEntity<?> addRequest(@RequestBody Request request) {
        try {
            return new ResponseEntity<>(requestService.createRequest(request), HttpStatus
                    .CREATED);
        } catch (IllegalArgumentException e) {
            // Returns an error message with status code 400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handling other possible exceptions
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/update/{requestId}")
    public ResponseEntity<?> updateRequest(@PathVariable int requestId, @RequestBody Request request) {
        try {
            return new ResponseEntity<>(requestService.updateRequest(requestId, request), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Returns an error message with status code 400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handling other possible exceptions
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateLocation/{requestId}/")
    public ResponseEntity<?> updateLocation(@PathVariable int requestId,
                                            @RequestParam(required = false) Double parentLatitude,
                                            @RequestParam(required = false) Double parentLongitude,
                                            @RequestParam(required = false) Double walkerLatitude,
                                            @RequestParam(required = false) Double walkerLongitude) {
        try {
            return new ResponseEntity<>(requestService.updateLocation(requestId, parentLatitude, parentLongitude, walkerLatitude, walkerLongitude), HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            // Returns an error message with status code 404 (Not found)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // Handling other possible exceptions
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/{requestId}")
    public ResponseEntity<String> deleteRequest(@PathVariable int requestId) {
        try {
            requestService.deleteRequest(requestId);
            return new ResponseEntity<>("Request with ID " + requestId + " was successfully deleted", HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("other error occurred:" + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/{requestId}/accept")

    public ResponseEntity<?> acceptRequest(@PathVariable int requestId, @RequestParam long walkerId) {
        try {
            if (requestService.acceptWalkerRequest(requestId, walkerId) == null){
                return new ResponseEntity<>("The request has been accepted by some parent.", HttpStatus.BAD_REQUEST);
            }
//        return new ResponseEntity<>(requestService.acceptWalkerRequest(requestId, walkerId), HttpStatus.OK);
            ResponseEntity<String> stringResponseEntity =
                    new ResponseEntity<>("The request has been accepted successfully by parent, whose walkerId is "
                            + walkerId, HttpStatus.OK);
            return stringResponseEntity;
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable int requestId, @RequestParam long walkerId) {
        if (requestService.rejectWalkerRequest(requestId, walkerId) == null){
            return new ResponseEntity<>("The request has been rejected by this parent", HttpStatus.BAD_REQUEST);
        }
//        return new ResponseEntity<>(requestService.rejectWalkerRequest(requestId, walkerId), HttpStatus.OK);
        return new ResponseEntity<>("The request has been rejected successfully by parent, whose walkerId is  " + walkerId, HttpStatus.OK);
    }


    @PostMapping("{requestId}/apply")
//    public ResponseEntity<WalkerRequest> applyRequest(@PathVariable int requestId, @RequestParam int parentId) {
//        WalkerRequest walkerRequest = requestService.applyRequest(requestId, parentId);
//        return new ResponseEntity<>(walkerRequest, HttpStatus.CREATED);

    public ResponseEntity<?> applyRequest(@PathVariable int requestId, @RequestParam long walkerId) {
        try {
            WalkerRequest walkerRequest = requestService.applyRequest(requestId, walkerId);
            WalkerRequestDTO walkerRequestDTO = new WalkerRequestDTO();
            walkerRequestDTO.setWalkerRequestId(walkerRequest.getWalkerRequestId());
            walkerRequestDTO.setStatus(walkerRequest.getStatus());
            walkerRequestDTO.setRequestId(walkerRequest.getRequest().getRequestId());
            walkerRequestDTO.setWalkerId(walkerRequest.getWalker().getId());
            return new ResponseEntity<>(walkerRequestDTO, HttpStatus.CREATED);
        } catch (IllegalStateException  e) {
            return new ResponseEntity<>("You have already applied for this request.", HttpStatus.CONFLICT);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {

            return new ResponseEntity<>("An error occurred while processing your request: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @PostMapping("{requestId}/cancelApply")
    public ResponseEntity<String> cancelApply(@PathVariable int requestId, @RequestParam long walkerId) {
        requestService.cancelApply(requestId, walkerId);
        return new ResponseEntity<>("Walker request cancelled successfully.", HttpStatus.OK);
    }

    @PutMapping("/completeRequest/{requestId}/{walkerId}")
    public ResponseEntity<String> completeRequest(@PathVariable int requestId, @PathVariable long walkerId) {
        requestService.completeRequest(requestId, walkerId);
        return new ResponseEntity<>("Request Complete successfully.", HttpStatus.OK);
    }

    @DeleteMapping("/{requestId}/{walkerRequestId}/cancel")
    public ResponseEntity<Void> cancelRequest(@PathVariable int requestId, @PathVariable long walkerRequestId) {
        requestService.cancelRequest(requestId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/searchRequests")
    public ResponseEntity<?> searchRequests(@RequestParam long walkerId,
                                            @RequestParam String searchTerm,
                                            @RequestParam(required = false) String distance,
                                            @RequestParam(required = false) Date startTime,
                                            @RequestParam(required = false) Date arriveTime) {
        try {
            List<Request> requests = requestService.searchRequests(walkerId, searchTerm, distance, startTime, arriveTime);
            return new ResponseEntity<>(requests, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            // Handle custom exceptions where resources cannot be found
            return new ResponseEntity<>(
                    Map.of("message", e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception e) {
            // Catch all other exceptions and return 500 server errors
            return new ResponseEntity<>(
                    Map.of("message", "An unexpected error occurred: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getRequestStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalRequests = requestService.getTotalRequests();
        long publishedRequests = requestService.getRequestsByStatus("Published");
        long acceptedRequests = requestService.getRequestsByStatus("Accepted");
        long finishedRequests = requestService.getRequestsByStatus("Finished");

        stats.put("totalRequests", totalRequests);
        stats.put("publishedRequests", publishedRequests);
        stats.put("acceptedRequests", acceptedRequests);
        stats.put("finishedRequests", finishedRequests);

        return ResponseEntity.ok(stats);
    }
}
