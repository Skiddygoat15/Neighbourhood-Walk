package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Service.WalkerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/WalkerRequest")
public class WalkerRequestController {

    @Autowired
    private WalkerRequestService walkerRequestService;

    @GetMapping("/getWalkerRequest/{walkerId}")
    public WalkerRequest getWalkerRequest(@PathVariable("walkerId") long walkerId) {
        return walkerRequestService.getWalkerRequest(walkerId);
    }

    @GetMapping("/getRequest/{walkerRequestId}")
    public int getRequest(@PathVariable("walkerRequestId") long walkerRequestId) {
        return walkerRequestService.getRequest(walkerRequestId);
    }
}
