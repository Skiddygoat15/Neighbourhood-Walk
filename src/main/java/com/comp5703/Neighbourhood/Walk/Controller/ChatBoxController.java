package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Service.ChatBoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ChatBox")
public class ChatBoxController {

    @Autowired
    private ChatBoxService chatBoxService;

    @PostMapping("/addChatBox")
    public ResponseEntity<?> addChatBox(@RequestParam long userIdFrom, @RequestParam long userIdTo,
                                        @RequestParam String roleTypeFrom, @RequestParam String roleTypeTo, @RequestParam String message){
        ChatBox chatBoxResponse = chatBoxService.saveChatBox(userIdFrom,userIdTo,roleTypeFrom,roleTypeTo,message);
        return new ResponseEntity<>(chatBoxResponse, HttpStatus.OK);
    }

    @GetMapping("/getChatBoxes")
    public ResponseEntity<?> getChatBoxesByRoleFromAndRoleTo(@RequestParam long userIdFrom, @RequestParam long userIdTo,
                                          @RequestParam String roleTypeFrom, @RequestParam String roleTypeTo){
        List<ChatBox> chatBoxResponse = chatBoxService.getChatBoxes(userIdFrom,userIdTo,roleTypeFrom,roleTypeTo);
        return new ResponseEntity<>(chatBoxResponse, HttpStatus.OK);
    }

    @GetMapping("/getChatBox/{chatBoxId}")
    public ResponseEntity<?> getChatBox(@PathVariable("chatBoxId") long chatBoxId) {
        return new ResponseEntity<>(chatBoxService.getChatBox(chatBoxId), HttpStatus.OK);
    }

    @DeleteMapping("/deleteChatBox/{chatBoxId}")
    public ResponseEntity<?> deleteChatBox(@PathVariable("chatBoxId") long chatBoxId){
        chatBoxService.deleteChatBox(chatBoxId);
        return new ResponseEntity<>("Successfully deleted the chatBox.", HttpStatus.OK);
    }
}
