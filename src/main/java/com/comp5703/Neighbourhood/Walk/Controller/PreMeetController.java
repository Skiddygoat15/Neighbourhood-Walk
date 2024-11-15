package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.PreMeet;
import com.comp5703.Neighbourhood.Walk.Entities.PreMeetDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.PreMeetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/preMeet")
public class PreMeetController {
    @Autowired
    private PreMeetService preMeetService;

    // Get all premeets associated with that parent according to parentId
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<PreMeetDTO>> getPreMeetsByParentId(@PathVariable("parentId") long parentId) {
        List<PreMeetDTO> preMeets = preMeetService.getPreMeetsByParentId(parentId);
        return new ResponseEntity<>(preMeets, HttpStatus.OK);
    }

    // Get all premeets associated with a walker based on its walkerId
    @GetMapping("/walker/{walkerId}")
    public ResponseEntity<List<PreMeetDTO>> getPreMeetsByWalkerId(@PathVariable("walkerId") long walkerId) {
        List<PreMeetDTO> preMeets = preMeetService.getPreMeetsByWalkerId(walkerId);
        return new ResponseEntity<>(preMeets, HttpStatus.OK);
    }


    @PostMapping("/create/{parentId}/{walkerId}/{requestId}")
    public ResponseEntity<PreMeet> createPreMeet(
            @PathVariable long parentId,
            @PathVariable long walkerId,
            @PathVariable int requestId,
            @RequestBody PreMeet preMeetRequest) {


        System.out.println("preMeetRequest:" + preMeetRequest.getTime());
        PreMeet preMeet = new PreMeet();
        preMeet.setTime(preMeetRequest.getTime());
        preMeet.setPreMeetType(preMeetRequest.getPreMeetType());
        preMeet.setContactApproach(preMeetRequest.getContactApproach());
        preMeet.setUrlOrAddress(preMeetRequest.getUrlOrAddress());
        preMeet.setNewOrNot(preMeetRequest.isNewOrNot());


        PreMeet createdPreMeet = preMeetService.createPreMeet(preMeet, parentId, walkerId, requestId);
        return ResponseEntity.ok(createdPreMeet);
    }


    // Get the relevant PreMeet for the request based on requestId
    @GetMapping("/request/{requestId}")
    public ResponseEntity<PreMeetDTO> getPreMeetByRequestId(@PathVariable("requestId") int requestId) {
        Optional<PreMeetDTO> preMeet = preMeetService.getPreMeetByRequestId(requestId);
        return preMeet.map(meet -> new ResponseEntity<>(meet, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Set the newOrNot field in PreMeet to false
    @PutMapping("/update/{preMeetId}")
    public ResponseEntity<Void> updateNewOrNotStatus(@PathVariable("preMeetId") long preMeetId) {
        try {
            preMeetService.updateNewOrNotStatus(preMeetId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Check if there is a PreMeet for a walkerId with the newOrNot field set to true
    @GetMapping("/walker/{walkerId}/newOrNot")
    public ResponseEntity<Boolean> checkNewPreMeetByWalkerId(@PathVariable("walkerId") long walkerId) {
        boolean hasNewPreMeet = preMeetService.checkNewPreMeetByWalkerId(walkerId);
        return new ResponseEntity<>(hasNewPreMeet, HttpStatus.OK);
    }
}
