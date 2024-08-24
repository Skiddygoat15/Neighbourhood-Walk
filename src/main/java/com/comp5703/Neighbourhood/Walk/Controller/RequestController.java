package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    public ResponseEntity addRequest(@RequestBody Request request) {
        return new ResponseEntity<>(requestService.createRequest(request), HttpStatus
                .CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity updateRequest(@PathVariable int id, @RequestBody Request request) {
        return new ResponseEntity<>(requestService.updateRequest(id, request), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteRequest(@PathVariable int id) {
        requestService.deleteRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity acceptRequest(@PathVariable int id, @RequestParam int walkerId) {
        return new ResponseEntity<>(requestService.acceptRequest(id, walkerId), HttpStatus.OK);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Request> rejectRequest(@PathVariable int id, @RequestParam int walkerId) {
        return new ResponseEntity<>(requestService.rejectRequest(id, walkerId), HttpStatus.OK);
    }
}
