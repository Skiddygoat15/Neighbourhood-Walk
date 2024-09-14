package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Service.WalkerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/getWalkerRequest/{walkerId}")
    public WalkerRequest getWalkerRequestByWalkerId(@PathVariable("walkerId") long walkerId) {
        return walkerRequestService.getWalkerRequest(walkerId);
    }

    @GetMapping("/getRequest/{walkerRequestId}")
    public int getRequestByWalkerRequestId(@PathVariable("walkerRequestId") long walkerRequestId) {
        return walkerRequestService.getRequest(walkerRequestId);
    }

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
