package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBar;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.ChatBarRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.ChatBarService;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatBarServiceImpl implements ChatBarService {

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private ChatBarRepository chatBarRepository;

    @Override
    public ChatBar saveChatBar(long userIdFrom, long userIdTo) {

        Users roleFromCheck = usersRepository.getById(userIdFrom);
        if (roleFromCheck == null){
            throw new IllegalArgumentException("UserFrom not found.");
        }

        Users roleToCheck = usersRepository.getById(userIdTo);
        if (roleToCheck == null){
            throw new IllegalArgumentException("UserTo not found.");
        }

        ChatBar chatBarCheck = chatBarRepository.findByUserFromIdAndUserToId(userIdFrom, userIdTo);
        if (chatBarCheck != null){
            throw new IllegalArgumentException("ChatBar has already created.");
        }
        return chatBarRepository.save(new ChatBar(roleFromCheck, roleToCheck));
    }

    @Override
    public List<ChatBar> getChatBars(long userFromId) {
        Iterable<ChatBar> chatBars = chatBarRepository.findAllByUserFromId(userFromId);
        if (chatBars != null){
            List<ChatBar> chatBarList = new ArrayList<>();
            for (ChatBar chatBar:chatBars){chatBarList.add(chatBar);}
//            chatBars.forEach(chatBarList::add);
            return chatBarList;
        }else {
            return null;
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
    public void deleteChatBar(long userIdFrom, long userIdTo) {
        ChatBar chatBar = chatBarRepository.findByUserFromIdAndUserToId(userIdFrom, userIdTo);
        if(chatBar != null){
            chatBarRepository.delete(chatBar);
        }else {
            throw new IllegalArgumentException("ChatBar not found.");
        }
    }

    @Override
    public void updateChatBar(long userIdFrom, long userIdTo,String state) {
        ChatBar chatBar = chatBarRepository.findByUserFromIdAndUserToId(userIdFrom, userIdTo);
        if(chatBar != null){
            chatBar.setState(state);
            chatBarRepository.save(chatBar);
        }else {
            throw new IllegalArgumentException("ChatBar not found.");
        }
    }
}
