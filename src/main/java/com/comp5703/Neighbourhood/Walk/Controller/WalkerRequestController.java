package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import com.comp5703.Neighbourhood.Walk.Service.WalkerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;


@RestController
@RequestMapping("/WalkerRequest")
public class WalkerRequestController {

    @Autowired
    private WalkerRequestService walkerRequestService;

    @Autowired
    private RequestService requestService;

    @GetMapping("/getWalkerRequest/{walkerId}")
    public ResponseEntity<WalkerRequest> getWalkerRequestByWalkerId(@PathVariable("walkerId") long walkerId) {
        return new ResponseEntity<>(walkerRequestService.getWalkerRequest(walkerId), HttpStatus.OK);
    }

    @GetMapping("/getRequestByWalkerRequestId/{walkerRequestId}")
    public ResponseEntity<Request> getRequestByWalkerRequest(@PathVariable("walkerRequestId") long walkerRequestId) {
        return new ResponseEntity<>(walkerRequestService.getRequest(walkerRequestId), HttpStatus.OK);
    }


//    @GetMapping("/getRequestByWalkerId/{walkerId}")
//    public ResponseEntity<Request> getRequestByWalkerId(@PathVariable("walkerId") long walkerId) {
//        WalkerRequest walkerRequest = walkerRequestService.getWalkerRequest(walkerId);
//        Request request = walkerRequestService.getRequest(walkerRequest.getWalkerRequestId());
//        return new ResponseEntity<>(request, HttpStatus.OK);
//    }

    @GetMapping("/getWalkersByRequestId/{requestId}")
    public ResponseEntity<List<Users>> getWalkersByRequestId(@PathVariable int requestId) {
        List<Users> walkers = walkerRequestService.getWalkersByRequestId(requestId);
        return ResponseEntity.ok(walkers);
    }

    @GetMapping("/getRequestsByWalkerId/{walkerId}")
    public ResponseEntity<List<Request>> getRequestsByWalkerId(@PathVariable int walkerId) {
        List<Request> requests = walkerRequestService.getRequestsByWalkerId(walkerId);
        return ResponseEntity.ok(requests);
    }
}
