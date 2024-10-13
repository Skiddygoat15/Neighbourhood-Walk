package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBar;
import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.ChatBarRepository;
import com.comp5703.Neighbourhood.Walk.Repository.ChatRoomRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.ChatBarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatBarServiceImpl implements ChatBarService {

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private ChatBarRepository chatBarRepository;
    @Override
    public ChatBar saveChatBar(long userIdFrom, long userIdTo) {

        Users roleFromChecked = null;
        Users roleFromCheck = usersRepository.getById(userIdFrom);
        if (roleFromCheck != null){
            roleFromChecked = roleFromCheck;
        }else {
            throw new IllegalArgumentException("UserFrom not found.");
        }

        Users roleToChecked = null;
        Users roleToCheck = usersRepository.getById(userIdTo);
        if (roleToCheck != null){
            roleToChecked = roleFromCheck;
        }else {
            throw new IllegalArgumentException("UserTo not found.");
        }

        return new ChatBar(roleFromChecked,roleToChecked);
    }

    @Override
    public List<ChatBar> getChatBars(long userFromId) {
        Iterable<ChatBar> chatBars = chatBarRepository.findAllByUserFromId(userFromId);
        if (chatBars != null){
            List<ChatBar> chatBarList = new ArrayList<>();
//            for (ChatBar chatBar:chatBars){chatBarList.add(chatBar);}
            chatBars.forEach(chatBarList::add);
            return chatBarList;
        }else {
            throw new IllegalArgumentException("ChatBar not found.");
        }
    }

    @Override
    public ChatBar getChatBar(long userIdFrom, long userIdTo) {
        ChatBar chatBar = chatBarRepository.findByUserFromIdAndUserToId(userIdFrom, userIdTo);
        if(chatBar != null){
            return chatBar;
        }else {
            throw new IllegalArgumentException("ChatBar not found.");
        }
    }

    @Override
    public void deleteChatBox(long userIdFrom, long userIdTo) {
        ChatBar chatBar = chatBarRepository.findByUserFromIdAndUserToId(userIdFrom, userIdTo);
        if(chatBar != null){
            chatBarRepository.delete(chatBar);
        }else {
            throw new IllegalArgumentException("ChatBar not found.");
        }
    }
}
