package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.ChatRoom;
import com.comp5703.Neighbourhood.Walk.Entities.Role;

import java.util.List;

public interface ChatRoomService {
    ChatRoom saveChatBox(ChatRoom chatRoom);
    List<ChatBox> getChatBoxes(ChatRoom chatRoom);
    void deleteChatRoom(ChatRoom chatRoom);
}
