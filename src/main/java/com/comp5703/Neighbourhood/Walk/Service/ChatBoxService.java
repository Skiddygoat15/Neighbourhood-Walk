package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.Role;

import java.io.Serializable;
import java.util.List;

public interface ChatBoxService extends Serializable {
    ChatBox saveChatBox(ChatBox chatBox);
    List<ChatBox> getChatBox(Role roleFrom, Role roleTo);
    void deleteChatBox(ChatBox chatBox);
}
