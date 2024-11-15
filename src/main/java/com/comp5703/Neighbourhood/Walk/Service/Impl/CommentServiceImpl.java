package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Entities.CommentDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.CommentRepository;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.CommentService;
import com.comp5703.Neighbourhood.Walk.Utils.TwoTuple;
import com.comp5703.Neighbourhood.Walk.domain.dto.RateCommentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private UsersRepository usersRepository;

    @Override
    public Comment saveComment(Comment comment){

        Request request = requestRepository.getById(comment.getRequest().getRequestId());

        Users user = usersRepository.getById(comment.getUser().getId());
        int num_Of_Comment = commentRepository.findAllByUserId(user.getId()).size();
        user.setAvgUserRating((user.getAvgUserRating() * num_Of_Comment + comment.getRate()) / (num_Of_Comment+1));

        comment.setRequest(request);
        comment.setUser(user);
        return commentRepository.save(comment);
    }

    @Override
    public List<Long> getCommentedUserIds() {
        Iterable<Comment> iterable = commentRepository.findAll();
        Set<Long> set = new HashSet<>();

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

    @Override
    public Double getAveRateByUserId(long userid) {

        List<Comment> listComment = commentRepository.findAllByUserId(userid);

        List<Double> listRate = listComment.stream().map(comment -> {
            Double rate = comment.getRate();
            return rate;
        }).collect(Collectors.toList());

        return listRate.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    public List<Double> getAveRateByUserId(List<Long> useridList,boolean ascending) {
        return useridList.stream().map(userId -> getAveRateByUserId(userId)).toList();
    }

    /**
     * Determine if the user has a comment
     * @param userid
     * @return
     */
    @Override
    public Boolean IsUserHaveComment(long userid) {
        return !commentRepository.findAllByUserId(userid).isEmpty();
    }

    @Override
    public List<CommentDTO> getCommentsByReuqest(Integer requestId) {
        Optional<Request> requestCheck = requestRepository.findById(requestId);

        Request requestChecked = null;
        if (requestCheck.isPresent()){
            requestChecked = requestCheck.get();
        }

        List<Comment> commentsCheck = commentRepository.findByRequest(requestChecked);
        List<CommentDTO> commentsChecked = null;
        if (commentsCheck != null){
            List<CommentDTO> commentsCheckedInitial = commentsCheck.stream().map(comment -> {
                CommentDTO commentDTO = new CommentDTO();
                commentDTO.setCommentId(comment.getCommentId());
                commentDTO.setUserId(comment.getUser().getId());
                commentDTO.setRate(comment.getRate());
                commentDTO.setCommentDate(comment.getCommentDate());
                commentDTO.setComment(comment.getComment());
                commentDTO.setRequest(comment.getRequest());
                return commentDTO;
            }).collect(Collectors.toList());
            commentsChecked = commentsCheckedInitial;
        }else {
            return null;
        }

        return commentsChecked;
    }
}
