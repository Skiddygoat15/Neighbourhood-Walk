package com.comp5703.Neighbourhood.Walk.Controller;


import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.CommentService;
import com.comp5703.Neighbourhood.Walk.Utils.TwoTuple;
import com.comp5703.Neighbourhood.Walk.domain.BaseResponse;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Comment")
public class CommonController {

    @Autowired
    CommentService commentService;

    /*
        添加评论
     */
    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        Comment saveComment = commentService.saveComment(comment);
        return new ResponseEntity<>(saveComment, HttpStatus.CREATED);
    }

    /*
        根据userid获取评论，也可以根据rate筛选
    */
    @GetMapping("/getCommentByUserid/{userId}")
    public BaseResponse<List<String>> getCommentByUserid(@PathVariable("userId") String userId,
                                                 @RequestParam(value = "max",required = false, defaultValue = "5.0") double max,
                                                 @RequestParam(value = "min",required = false, defaultValue = "0.0") double min){

        List<String> list = null;
        try {
            list = commentService.getCommentByUserId(userId,max,min);
        } catch (Exception e) {
//            log.warn("获取评论失败! !",e);
            System.out.println("获取评论失败");
        }
//        list.forEach(System.out::println);
        return BaseResponse.success(list);
    }

    /*
    根据userid获取评论，也可以根据rate筛选
*/
    @GetMapping("/getCommentSortedByRate/{userId}")
    public BaseResponse<List<TwoTuple<Double, String>>> getCommentSortedByRate(@PathVariable("userId") String userId,
                                                                                @RequestParam(value = "ascending", required = false, defaultValue = "true") boolean ascending){
        List<TwoTuple<Double, String>> sortedComments = new ArrayList<>();

        try {
            sortedComments = commentService.getCommentSortedByRate(userId,ascending);
        } catch (Exception e) {
//            log.warn("获取排序评论失败! !",e);
            System.out.println("获取排序评论失败");
        }
//        list.forEach(System.out::println);
        System.out.println(sortedComments);
        return BaseResponse.success(sortedComments);
    }

}
