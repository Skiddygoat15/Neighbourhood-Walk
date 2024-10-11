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

    //todo getRequest(), getAllRequests()
    @GetMapping("/getRequestsByParentId/{parentId}")
    public ResponseEntity<List<Request>> getRequestsByParentId(@PathVariable Long parentId) {
        List<Request> requests = requestService.getRequestsByUserId(parentId);
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

    @GetMapping("/getAllRequests")
    public ResponseEntity<?> getAllRequests() {
        try {
            List<RequestDTO> request = requestService.getAllRequests();
            return new ResponseEntity<>(request, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * walker创建request
     * @param request
     * @return
     */
    @PostMapping
    public ResponseEntity<?> addRequest(@RequestBody Request request) {
        try {
            return new ResponseEntity<>(requestService.createRequest(request), HttpStatus
                    .CREATED);
        } catch (IllegalArgumentException e) {
            // 返回错误信息，状态码为400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 处理其他可能的异常
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * walker更新request
     * @param requestId
     * @param request
     * @return
     */
    @PutMapping("/update/{requestId}")
    public ResponseEntity<?> updateRequest(@PathVariable int requestId, @RequestBody Request request) {
        try {
            return new ResponseEntity<>(requestService.updateRequest(requestId, request), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // 返回错误信息，状态码为400 (Bad Request)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 处理其他可能的异常
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
     * @param walkerId
     * @return
     */
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

    /**
     * parent拒绝request
     * @param requestId
     * @param walkerId
     * @return
     */
    @PostMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable int requestId, @RequestParam long walkerId) {
        if (requestService.rejectWalkerRequest(requestId, walkerId) == null){
            return new ResponseEntity<>("The request has been rejected by this parent", HttpStatus.BAD_REQUEST);
        }
//        return new ResponseEntity<>(requestService.rejectWalkerRequest(requestId, walkerId), HttpStatus.OK);
        return new ResponseEntity<>("The request has been rejected successfully by parent, whose walkerId is  " + walkerId, HttpStatus.OK);
    }

    /**
     * parent应用request
     * @param requestId
     * @param walkerId
     * @return
     */
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
            // 409状态码 表示冲突 已经申请过
            return new ResponseEntity<>("You have already applied for this request.", HttpStatus.CONFLICT);
        } catch (ResourceNotFoundException e) {
            // 404 没找到request
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // 捕获其他异常并返回 400 状态码
            return new ResponseEntity<>("An error occurred while processing your request: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * parent取消应用request
     * @param requestId
     * @param walkerId
     * @return
     */
    @PostMapping("{requestId}/cancelApply")
    public ResponseEntity<String> cancelApply(@PathVariable int requestId, @RequestParam long walkerId) {
        requestService.cancelApply(requestId, walkerId);
        return new ResponseEntity<>("Walker request cancelled successfully.", HttpStatus.OK);
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
}
