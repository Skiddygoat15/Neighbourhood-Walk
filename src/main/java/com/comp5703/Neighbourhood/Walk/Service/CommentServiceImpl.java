package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Repository.CommentRepository;
import com.comp5703.Neighbourhood.Walk.Utils.TwoTuple;
import com.comp5703.Neighbourhood.Walk.domain.dto.RateCommentDTO;
import jakarta.persistence.Tuple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class CommentServiceImpl implements CommentService{

    @Autowired
    CommentRepository commentRepository;

    @Override
    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }


    @Override
    public List<String> getCommentByUserId(String userId,double max,double min) {
        List<Comment> comments = commentRepository.findAllByUserId(userId);
        double finalMax = max;
        double finalMin = min;

        List<String> commentsGet = comments.stream().map(comment -> {
            String commentContent = null;
            if (comment.getRate() <= finalMax && comment.getRate() >= finalMin) {
                commentContent = comment.getComment();
            }
            return commentContent;
        }).collect(Collectors.toList());
        commentsGet.removeIf(Objects::isNull);
        return commentsGet;
    }

    @Override
    public  List<RateCommentDTO> getCommentSortedByRate(String userId,boolean ascending) {
        List<Comment> comments = commentRepository.findAllByUserId(userId);

        if (ascending) {
            Collections.sort(comments, Comparator.comparing(Comment::getRate));
        } else {
            Collections.sort(comments, Comparator.comparing(Comment::getRate).reversed());
        }

        List<TwoTuple<Double, String>> list = new ArrayList<>();

        for (Comment element:comments){
            TwoTuple<Double, String> tuple = new TwoTuple<Double, String>(element.getRate(),element.getComment());
            list.add(tuple);
        }
        List<RateCommentDTO> result = list.stream()
                .map(comment -> new RateCommentDTO(comment.first, comment.second))
                .collect(Collectors.toList());
        return result;
    }

}
