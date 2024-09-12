package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;
    @Autowired
    private WalkerRequestRepository walkerRequestRepository;

    //todo getRequest(), getAllRequests()
    @GetMapping("/getRequestsByUserId/{userId}")
    public ResponseEntity<List<Request>> getRequestsByUserId(@PathVariable Long userId) {
        try {
            List<Request> requests = requestService.getRequestsByUserId(userId);
            return new ResponseEntity<>(requests, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 或返回 HttpStatus.NOT_FOUND
        }
    }

    @PostMapping
    public ResponseEntity<Request> addRequest(@RequestBody Request request) {
        return new ResponseEntity<>(requestService.createRequest(request), HttpStatus
                .CREATED);
    }

    @PutMapping("/{requestId}")
    public ResponseEntity<Request> updateRequest(@PathVariable int requestId, @RequestBody Request request) {
        return new ResponseEntity<>(requestService.updateRequest(requestId, request), HttpStatus.OK);
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
    public ResponseEntity<WalkerRequest> acceptRequest(@PathVariable int requestId, @RequestParam int walkerId) {
        return new ResponseEntity<>(requestService.acceptWalkerRequest(requestId, walkerId), HttpStatus.OK);
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<WalkerRequest> rejectRequest(@PathVariable int requestId, @RequestParam int walkerId) {
        return new ResponseEntity<>(requestService.rejectWalkerRequest(requestId, walkerId), HttpStatus.OK);
    }

    @PostMapping("{requestId}/apply")
    public ResponseEntity<WalkerRequest> applyRequest(@PathVariable int requestId, @RequestParam int walkerId) {
        WalkerRequest walkerRequest = requestService.applyRequest(requestId, walkerId);
        return new ResponseEntity<>(walkerRequest, HttpStatus.CREATED);
    }

    @PostMapping("{requestId}/cancelApply")
    public ResponseEntity<String> cancelApply(@PathVariable int requestId, @RequestParam int walkerId) {
        requestService.cancelApply(requestId, walkerId);
        return new ResponseEntity<>("Walker request cancelled successfully.", HttpStatus.OK);
    }

    @DeleteMapping("/{requestId}/{walkerRequestId}/cancel")
    public ResponseEntity<Void> cancelRequest(@PathVariable int requestId, @PathVariable int walkerRequestId) {
        requestService.cancelRequest(requestId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/searchRequests")
    public ResponseEntity<List<Request>> searchRequests(
            @RequestParam String searchTerm,
            @RequestParam(required = false) Date startTime,
            @RequestParam(required = false) Date arriveTime) {

        List<Request> requests = requestService.searchRequests(searchTerm, startTime, arriveTime);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
}
