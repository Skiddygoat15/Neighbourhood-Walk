package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBoxDTO;
import com.comp5703.Neighbourhood.Walk.Entities.ChatRoom;

import java.util.List;

public interface ChatRoomService {

    ChatRoom saveChatBox(long userIdFrom, long userIdTo, String roleTypeFrom, String roleTypeTo);
    List<ChatBoxDTO> getChatBoxes(String chatRoomId);
    void deleteChatRoom(String chatRoomId);
}
