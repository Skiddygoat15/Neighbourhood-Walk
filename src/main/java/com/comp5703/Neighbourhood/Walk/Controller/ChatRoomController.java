package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.ChatRoom;
import com.comp5703.Neighbourhood.Walk.Service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ChatRoom")
public class ChatRoomController {
    @Autowired
    private ChatRoomService chatRoomService;

    @GetMapping("/addChatRoom")
    public ChatRoom addChatRoom(@RequestBody ChatRoom chatRoom) {
        return chatRoomService.saveChatBox(chatRoom);
    }

    @GetMapping("/getChatBoxesFromChatRoom")
    public List<ChatBox> getChatBoxes(ChatRoom chatRoom) {
        return chatRoomService.getChatBoxes(chatRoom);
    }

    @DeleteMapping("/deleteChatRoom")
    public void deleteChatRoom(ChatRoom chatRoom) {
        chatRoomService.deleteChatRoom(chatRoom);
    }
}
