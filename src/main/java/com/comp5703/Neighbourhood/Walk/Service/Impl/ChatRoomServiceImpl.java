package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.ChatRoom;
import com.comp5703.Neighbourhood.Walk.Repository.ChatBoxRepository;
import com.comp5703.Neighbourhood.Walk.Repository.ChatRoomRepository;
import com.comp5703.Neighbourhood.Walk.Service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatRoomServiceImpl implements ChatRoomService {
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Override
    public ChatRoom saveChatBox(ChatRoom chatRoom) {
        return chatRoomRepository.save(chatRoom);
    }

    @Override
    public List<ChatBox> getChatBoxes(ChatRoom chatRoom) {
        ChatRoom chatRoomChecked = null;
        Optional<ChatRoom> chatRoomCheck = chatRoomRepository.findById(chatRoom.getId());
        if (chatRoomCheck.isPresent()){
            chatRoomChecked = chatRoomCheck.get();
        }else {
            throw new IllegalArgumentException("ChatRoom not found.");
        }

        if (chatRoomRepository.findById(chatRoomChecked.getId()).isPresent()){
            return chatRoomRepository.findById(chatRoomChecked.getId()).get().getChatBoxes();
        }else {
            throw new IllegalArgumentException("The ChatRoom does not have any ChatBox.");
        }
    }

    @Override
    public void deleteChatRoom(ChatRoom chatRoom) {
        chatRoomRepository.delete(chatRoom);
    }
}
