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
        List<Request> requests = requestService.getRequestsByUserId(userId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * walker创建request
     * @param request
     * @return
     */
    @PostMapping
    public ResponseEntity<Request> addRequest(@RequestBody Request request) {
        return new ResponseEntity<>(requestService.createRequest(request), HttpStatus
                .CREATED);
    }
    /**
     * walker更新request
     * @param requestId
     * @param request
     * @return
     */
    @PutMapping("/{requestId}")
    public ResponseEntity<Request> updateRequest(@PathVariable int requestId, @RequestBody Request request) {
        return new ResponseEntity<>(requestService.updateRequest(requestId, request), HttpStatus.OK);
    }

    /**
     * walker删除request
     * @param requestId
     * @return
     */
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

    /**
     * parent接受request
     * @param requestId
     * @param parentId
     * @return
     */
    @PostMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable int requestId, @RequestParam int parentId) {
        if (requestService.acceptWalkerRequest(requestId, parentId) == null){
            return new ResponseEntity<>("The request has been accepted by some walker.", HttpStatus.BAD_REQUEST);
        }
//        return new ResponseEntity<>(requestService.acceptWalkerRequest(requestId, walkerId), HttpStatus.OK);
        ResponseEntity<String> stringResponseEntity =
                new ResponseEntity<>("The request has been accepted successfully by walker, whose walkerId is "
                        + parentId, HttpStatus.OK);
        return stringResponseEntity;
    }

    /**
     * parent拒绝request
     * @param requestId
     * @param parentId
     * @return
     */
    @PostMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable int requestId, @RequestParam int parentId) {
        if (requestService.rejectWalkerRequest(requestId, parentId) == null){
            return new ResponseEntity<>("The request has been rejected by this walker", HttpStatus.BAD_REQUEST);
        }
//        return new ResponseEntity<>(requestService.rejectWalkerRequest(requestId, walkerId), HttpStatus.OK);
        return new ResponseEntity<>("The request has been rejected successfully by walker, whose walkerId is  " + parentId, HttpStatus.OK);
    }

    /**
     * parent应用request
     * @param requestId
     * @param parentId
     * @return
     */
    @PostMapping("{requestId}/apply")
    public ResponseEntity<WalkerRequest> applyRequest(@PathVariable int requestId, @RequestParam int parentId) {
        WalkerRequest walkerRequest = requestService.applyRequest(requestId, parentId);
        return new ResponseEntity<>(walkerRequest, HttpStatus.CREATED);
    }

    /**
     * parent取消应用request
     * @param requestId
     * @param walkerId
     * @return
     */
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
