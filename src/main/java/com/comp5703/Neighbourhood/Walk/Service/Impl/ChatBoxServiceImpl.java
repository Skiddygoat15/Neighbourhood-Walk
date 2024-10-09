package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Repository.ChatBoxRepository;
import com.comp5703.Neighbourhood.Walk.Service.ChatBoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatBoxServiceImpl implements ChatBoxService {
    @Autowired
    private ChatBoxRepository chatBoxRepository;

    @Override
    public ChatBox saveChatBox(ChatBox chatBox) {
        if (chatBox == null){
            throw new IllegalArgumentException("ChatBox not found with.");
        }
        return chatBoxRepository.save(chatBox);
    }

    @Override
    public List<ChatBox> getChatBox(Role roleFrom, Role roleTo) {
        return chatBoxRepository.findAllByRoleFromAndRoleTo(roleFrom, roleTo);
    }
}
