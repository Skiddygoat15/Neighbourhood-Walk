package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.ChatRoom;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Repository.ChatBoxRepository;
import com.comp5703.Neighbourhood.Walk.Repository.ChatRoomRepository;
import com.comp5703.Neighbourhood.Walk.Repository.RoleRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.ChatBoxService;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatBoxServiceImpl implements ChatBoxService {

    @Autowired
    private ChatBoxRepository chatBoxRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public ChatBox saveChatBox(long userIdFrom, long userIdTo, String roleTypeFrom, String roleTypeTo, String message) {
        Role roleFromChecked = null;
        Optional<Role> roleFromCheck = roleRepository.findByUserIdAndRoleType(usersRepository.getById(userIdFrom), roleTypeFrom);
        if (roleFromCheck.isPresent()){
            roleFromChecked = roleFromCheck.get();
        }else {
            throw new IllegalArgumentException("RoleFrom not found.");
        }

        Role roleToChecked = null;
        Optional<Role> roleToCheck = roleRepository.findByUserIdAndRoleType(usersRepository.getById(userIdTo), roleTypeTo);
        if (roleToCheck.isPresent()){
            roleToChecked = roleToCheck.get();
        }else {
            throw new IllegalArgumentException("RoleTo not found.");
        }

        String chatRoomId = "room_" + Math.min(userIdFrom, userIdTo) + "_" + Math.max(userIdFrom, userIdTo);

        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);
        if (chatRoom.isPresent()){
            ChatBox chatBox = new ChatBox(roleFromChecked, roleToChecked, message, chatRoom.get());
            return chatBoxRepository.save(chatBox);
        }else {
            throw new IllegalArgumentException("ChatRoom not found.");
        }
    }

    @Override
    public List<ChatBox> getChatBoxes(long userIdFrom, long userIdTo, String roleTypeFrom, String roleTypeTo) {
        Role roleFromChecked = null;
        Optional<Role> roleFromCheck = roleRepository.findByUserIdAndRoleType(usersRepository.getById(userIdFrom), roleTypeFrom);
        if (roleFromCheck.isPresent()){
            roleFromChecked = roleFromCheck.get();
        }else {
            throw new IllegalArgumentException("RoleFrom not found.");
        }

        Role roleToChecked = null;
        Optional<Role> roleToCheck = roleRepository.findByUserIdAndRoleType(usersRepository.getById(userIdTo), roleTypeTo);
        if (roleToCheck.isPresent()){
            roleToChecked = roleToCheck.get();
        }else {
            throw new IllegalArgumentException("RoleTo not found.");
        }

        return chatBoxRepository.findAllByRoleFromAndRoleTo(roleFromChecked, roleToChecked);
    }

    @Override
    public ChatBox getChatBox(long chatBoxId) {
        Optional<ChatBox> chatBoxCheck = chatBoxRepository.findById(chatBoxId);
        if (chatBoxCheck.isPresent()){
            return chatBoxCheck.get();
        }else {
            throw new IllegalArgumentException("ChatBox not found.");
        }
    }

    @Override
    public void deleteChatBox(long chatBoxId) {
        Optional<ChatBox> chatBoxCheck = chatBoxRepository.findById(chatBoxId);
        if (chatBoxCheck.isPresent()){
            chatBoxRepository.delete(chatBoxCheck.get());
        }else {
            throw new IllegalArgumentException("ChatBox not found.");
        }
    }
}
