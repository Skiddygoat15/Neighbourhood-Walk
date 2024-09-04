package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
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

    @PostMapping
    public ResponseEntity<Request> addRequest(@RequestBody Request request) {
        return new ResponseEntity<>(requestService.createRequest(request), HttpStatus
                .CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable int id, @RequestBody Request request) {
        return new ResponseEntity<>(requestService.updateRequest(id, request), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable int id) {
        requestService.deleteRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<WalkerRequest> acceptRequest(@PathVariable int id, @RequestParam int walkerId) {
        return new ResponseEntity<>(requestService.acceptWalkerRequest(id, walkerId), HttpStatus.OK);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<WalkerRequest> rejectRequest(@PathVariable int id, @RequestParam int walkerId) {
        return new ResponseEntity<>(requestService.rejectWalkerRequest(id, walkerId), HttpStatus.OK);
    }

    @PostMapping("{id}/apply")
    public ResponseEntity<WalkerRequest> applyRequest(@PathVariable int id, @RequestParam int walkerId) {
        WalkerRequest walkerRequest = requestService.applyRequest(id, walkerId);
        return new ResponseEntity<>(walkerRequest, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}/{walkerRequestId}/cancel")
    public ResponseEntity<Void> cancelRequest(@PathVariable int id, @PathVariable int walkerRequestId) {
        requestService.cancelRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Request>> searchRequests(
            @RequestParam String searchTerm,
            @RequestParam(required = false) Date startTime,
            @RequestParam(required = false) Date arriveTime) {

        List<Request> requests = requestService.searchRequests(searchTerm, startTime, arriveTime);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
}
