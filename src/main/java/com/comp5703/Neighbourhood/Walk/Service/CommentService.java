package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Utils.TwoTuple;
import com.comp5703.Neighbourhood.Walk.domain.dto.RateCommentDTO;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public interface CommentService extends Serializable {
    Comment saveComment(Comment comment);
    List<String> getCommentByUserId(String userid,double max,double min);
    List<RateCommentDTO> getCommentSortedByRate(String userId, boolean ascending);
}
