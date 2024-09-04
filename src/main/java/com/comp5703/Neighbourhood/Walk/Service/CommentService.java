package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;

import java.io.Serializable;
import java.util.List;

public interface CommentService extends Serializable {
    Comment saveComment(Comment comment);
}
