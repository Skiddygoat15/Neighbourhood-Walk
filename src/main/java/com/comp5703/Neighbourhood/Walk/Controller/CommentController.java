package com.comp5703.Neighbourhood.Walk.Controller;


import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Entities.CommentDTO;
import com.comp5703.Neighbourhood.Walk.Service.CommentService;
import com.comp5703.Neighbourhood.Walk.Service.RequestService;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import com.comp5703.Neighbourhood.Walk.domain.dto.RateCommentDTO;
import com.comp5703.Neighbourhood.Walk.domain.dto.UserIdNameAverateDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/Comment")
public class CommentController {

    @Autowired
    CommentService commentService;

    @Autowired
    UsersService usersService;

    @Autowired
    RequestService requestService;

    @PostMapping
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> addComment(@RequestBody Comment comment) throws Exception {
        Comment saveComment = null;
        System.out.println("comment.getRequest().getId() is "+comment.getRequest().getRequestId());
        System.out.println("comment.getRequest().getStatus() is "+comment.getRequest().getStatus());
        if (!Objects.equals(requestService.getById(comment.getRequest().getRequestId()).getStatus(), "Completed")){
            return new ResponseEntity<>("This request has not been Completed.", HttpStatus.FAILED_DEPENDENCY);
        }
        try {
            saveComment = commentService.saveComment(comment);
            return new ResponseEntity<>(saveComment, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("There is no user with this userId.", HttpStatus.FAILED_DEPENDENCY);
        } catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CREATED);
        }
    }

    @GetMapping("/getCommentByUserid/{userId}")
    public ResponseEntity<List<String>> getCommentByUserid(@PathVariable("userId") long userId,
                                                 @RequestParam(value = "max",required = false, defaultValue = "5.0") double max,
                                                 @RequestParam(value = "min",required = false, defaultValue = "0.0") double min){

        List<String> list = null;
        try {
            list = commentService.getCommentByUserId(userId,max,min);
        } catch (Exception e) {
            System.out.println("Failed to get comments");
        }
        return new ResponseEntity<>(list,HttpStatus.ALREADY_REPORTED);
    }

    @GetMapping("/getCommentSortedByRate/{userId}")
    public ResponseEntity<List<RateCommentDTO>> getCommentSortedByRate(@PathVariable("userId") long userId,
                                                                                @RequestParam(value = "ascending", required = false, defaultValue = "true") boolean ascending){
        List<RateCommentDTO> sortedComments = new ArrayList<>();

        try {
            sortedComments = commentService.getCommentSortedByRate(userId,ascending);
        } catch (Exception e) {
            System.out.println("Failed to get sorted comments");
        }
        return new ResponseEntity(sortedComments,HttpStatus.ALREADY_REPORTED);
    }

    @GetMapping("/getAveRateByUserId/{userId}")
    public Double getAveRateByUserId(@PathVariable("userId") long userId) throws Exception {

        if (commentService.IsUserHaveComment(userId)){
            return commentService.getAveRateByUserId(userId);
        }else {
            throw new Exception("This user currently has no comments");
        }
    }

    @GetMapping("/getRankByAveRate")
    public ResponseEntity<List<UserIdNameAverateDTO>> getRankByAveRate(
            @RequestParam(value = "ascending",required = false,defaultValue = "true") boolean ascending) throws Exception {

        List<Long> userIdList = commentService.getCommentedUserIds();
        System.out.println(userIdList);
        List<UserIdNameAverateDTO> list = userIdList.stream().map(userIds -> {
            long userId = userIds;
            String userName = usersService.getUserById(userId).getName();
            Double AveRate = null;
            try {
                AveRate = getAveRateByUserId(userId);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            return new UserIdNameAverateDTO(userId, userName, AveRate);
        }).collect(Collectors.toList());
        if (list.isEmpty()){throw new Exception("There are currently no commented users");}
        if (ascending == true){
            list.sort(Comparator.comparing(UserIdNameAverateDTO::getRate));
        }else {
            list.sort(Comparator.comparing(UserIdNameAverateDTO::getRate).reversed());
        }
        return new ResponseEntity(list,HttpStatus.ALREADY_REPORTED);
    }


    @GetMapping("/getCommentsByReuqestId/{requestId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByReuqest(@PathVariable("requestId") Integer requestId) {
        return new ResponseEntity(commentService.getCommentsByReuqest(requestId),HttpStatus.OK);
    }
}
