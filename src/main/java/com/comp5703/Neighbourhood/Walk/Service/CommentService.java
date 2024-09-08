package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Utils.TwoTuple;
import com.comp5703.Neighbourhood.Walk.domain.dto.RateCommentDTO;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface CommentService extends Serializable {
    Comment saveComment(Comment comment);
    List<Long> getCommentedUserIds();
    List<Comment> getCommentByUserId(long userid);
    List<String> getCommentByUserId(long userid,double max,double min);
    List<RateCommentDTO> getCommentSortedByRate(long userid, boolean ascending);
    Double getAveRateByUserId(long userid);
    List<Double> getAveRateByUserId(List<Long> useridList,boolean ascending);
    Boolean IsUserHaveComment(long userid);
}
