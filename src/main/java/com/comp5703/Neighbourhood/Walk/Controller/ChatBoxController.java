package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Service.ChatBoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ChatBox")
public class ChatBoxController {

    @Autowired
    private ChatBoxService chatBoxService;

    @PostMapping("/addChatBox")
    public ResponseEntity<?> addChatBox(@RequestBody ChatBox chatBox){
        ChatBox chatBoxResponse = chatBoxService.saveChatBox(chatBox);
        return new ResponseEntity<>(chatBoxResponse, HttpStatus.OK);
    }

    @GetMapping("/getChatBox")
    public ResponseEntity<?> getChatBox(@RequestParam("roleFrom") Role roleFrom,@RequestParam("roleTo") Role roleTo){
        List<ChatBox> chatBoxResponse = chatBoxService.getChatBox(roleFrom,roleTo);
        return new ResponseEntity<>(chatBoxResponse, HttpStatus.OK);
    }

    @DeleteMapping("/deleteChatBox")
    public void deleteChatBox(@RequestBody ChatBox chatBox){
        chatBoxService.deleteChatBox(chatBox);
    }
}
