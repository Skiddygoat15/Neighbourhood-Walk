package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Service.ChatBarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/ChatBar")
public class ChatBarController {

    @Autowired
    private ChatBarService chatBarService;

    @PostMapping("/addChatBar")
    public ResponseEntity<?> saveChatBar(@RequestParam long userIdFrom,@RequestParam long userIdTo) {
        chatBarService.saveChatBar(userIdFrom, userIdTo);
        return new ResponseEntity<>("Successfully added chatBar", HttpStatus.OK);
    }

    @GetMapping("/getChatBars/{userFromId}")
    public ResponseEntity<?>  getChatBarsOfCertainUser(@PathVariable("userFromId") long userFromId) {
        return new ResponseEntity<>(chatBarService.getChatBars(userFromId), HttpStatus.OK);
    }

    @GetMapping("/getChatBar")
    public ResponseEntity<?>  getChatBar(@RequestParam long userIdFrom,@RequestParam long userIdTo) {
        return new ResponseEntity<>(chatBarService.getChatBar(userIdFrom,userIdTo), HttpStatus.OK);
    }

    @DeleteMapping("/deleteChatBar")
    public ResponseEntity<?>  deleteChatBar(@RequestParam long userIdFrom,@RequestParam long userIdTo) {
        chatBarService.deleteChatBar(userIdFrom,userIdTo);
        return new ResponseEntity<>("Successfully deleted the chatBar.", HttpStatus.OK);
    }

    @PostMapping("/updateChatBar")
    public ResponseEntity<?> updateChatBar(@RequestParam long userIdFrom,@RequestParam long userIdTo,@RequestParam String state) {
        chatBarService.updateChatBar(userIdFrom,userIdTo,state);
        return new ResponseEntity<>("Successfully updated the chatBar.", HttpStatus.OK);
    }
}
