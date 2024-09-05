package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Repository.CommentRepository;
import com.comp5703.Neighbourhood.Walk.Service.CommentService;
import com.comp5703.Neighbourhood.Walk.Utils.TwoTuple;
import com.comp5703.Neighbourhood.Walk.domain.dto.RateCommentDTO;
import jakarta.persistence.Tuple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    CommentRepository commentRepository;

    @Override
    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }

    /**
     * 统计曾受到Comment的userIds
     * @return
     */
    @Override
    public List<Long> getCommentedUserIds() {
        Iterable<Comment> iterable = commentRepository.findAll();
        Set<Long> set = new HashSet<>();
        //userId去重
        for (Comment comment : iterable) {set.add(comment.getUser().getId());}
        ArrayList<Long> list = new ArrayList<>(set);
        return list;
    }

    @Override
    public List<Comment> getCommentByUserId(long userId) {
        return commentRepository.findAllByUserId(userId);
    }


    @Override
    public List<String> getCommentByUserId(long userId,double max,double min) {
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
    public  List<RateCommentDTO> getCommentSortedByRate(long userId,boolean ascending) {
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

    /**
     * 返回usrId对应的rate的均值
     * @param userid
     * @return
     */
    @Override
    public Double getAveRateByUserId(long userid) {
        List<Comment> listComment = commentRepository.findAllByUserId(userid);

        List<Double> listRate = listComment.stream().map(comment -> {
            Double rate = comment.getRate();
            return rate;
        }).collect(Collectors.toList());

        return listRate.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    /**
     * 返回多个userId对应rate均值的排名
     * @param useridList
     * @param ascending
     * @return
     */
    public List<Double> getAveRateByUserId(List<Long> useridList,boolean ascending) {
        return useridList.stream().map(userId -> getAveRateByUserId(userId)).toList();
    }
}