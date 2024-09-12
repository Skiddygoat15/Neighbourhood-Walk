package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
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

    @GetMapping("/getWalkerRequest/{walkerId}")
    public ResponseEntity<WalkerRequest> getWalkerRequestByWalkerId(@PathVariable("walkerId") long walkerId) {
        return new ResponseEntity<>(walkerRequestService.getWalkerRequest(walkerId), HttpStatus.OK);
    }

    @GetMapping("/getRequest/{walkerRequestId}")
    public ResponseEntity<Integer> getRequestByWalkerRequestId(@PathVariable("walkerRequestId") long walkerRequestId) {
        return new ResponseEntity<>(walkerRequestService.getRequest(walkerRequestId), HttpStatus.OK);
    }
}
