package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBar;

import java.io.Serializable;
import java.util.List;

public interface ChatBarService extends Serializable {
    ChatBar saveChatBar(long userIdFrom, long userIdTo);
    List<ChatBar> getChatBars(long userId);
    ChatBar getChatBar(long userIdFrom, long userIdTo);
    void deleteChatBar(long userIdFrom, long userIdTo);
    void updateChatBar(long userIdFrom, long userIdTo, String state);
}
