package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.Role;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

public interface ChatBoxService extends Serializable {
    ChatBox saveChatBox(long userIdFrom, long userIdTo, String roleTypeFrom, String roleTypeTo, String message);
    List<ChatBox> getChatBoxes(long userIdFrom, long userIdTo, String roleTypeFrom, String roleTypeTo);
    ChatBox getChatBox(long chatBoxId);
    void deleteChatBox(long chatBoxId);
}
