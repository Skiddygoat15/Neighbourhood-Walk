package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ChatRoom")
public class ChatRoomController {
    @Autowired
    private ChatRoomService chatRoomService;

    @PostMapping("/addChatRoom")
    public ResponseEntity<?> addChatRoom(@RequestParam long userIdFrom,@RequestParam long userIdTo,
                                @RequestParam String roleTypeFrom,@RequestParam String roleTypeTo) {
        return new ResponseEntity<>(chatRoomService.saveChatBox(userIdFrom,userIdTo,roleTypeFrom,roleTypeTo), HttpStatus.OK);
    }

    @GetMapping("/getChatBoxesFromChatRoom/{chatRoomId}")
    public ResponseEntity<?> getChatBoxes(@PathVariable("chatRoomId") String chatRoomId) {
        return new ResponseEntity<>(chatRoomService.getChatBoxes(chatRoomId), HttpStatus.OK);
    }

    @DeleteMapping("/deleteChatRoom/{chatRoomId}")
    public ResponseEntity<?> deleteChatRoom(@PathVariable("chatRoomId") String chatRoomId) {
        chatRoomService.deleteChatRoom(chatRoomId);
        return new ResponseEntity<>("Successfully deleted", HttpStatus.OK);
    }
}
