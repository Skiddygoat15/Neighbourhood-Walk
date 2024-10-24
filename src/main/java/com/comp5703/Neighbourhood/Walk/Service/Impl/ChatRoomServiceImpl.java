package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.ChatBoxDTO;
import com.comp5703.Neighbourhood.Walk.Entities.ChatRoom;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Repository.ChatRoomRepository;
import com.comp5703.Neighbourhood.Walk.Repository.RoleRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatRoomServiceImpl implements ChatRoomService {
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UsersRepository usersRepository;

//    @Override
//    public ChatRoom saveChatBox(ChatRoom chatRoom) {
//        return chatRoomRepository.save(chatRoom);
//    }

    @Override
    public ChatRoom saveChatBox(long userIdFrom, long userIdTo, String roleTypeFrom, String roleTypeTo) {

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

        if (chatRoomRepository.findById(chatRoomId).isPresent()){throw new IllegalArgumentException("ChatRoom has already built to the parent and walker.");}

        ChatRoom chatRoom = new ChatRoom(chatRoomId,null,roleFromChecked,roleToChecked);

        return chatRoomRepository.save(chatRoom);
    }

    @Override
    public List<ChatBoxDTO> getChatBoxes(String chatRoomId) {
        Optional<ChatRoom> chatRoomCheck = chatRoomRepository.findById(chatRoomId);
        if (chatRoomCheck.isPresent()){
            List<ChatBox> chatBoxes = chatRoomCheck.get().getChatBoxes();
            List<ChatBoxDTO> chatBoxDTOs = chatBoxes.stream().map(chatBox -> {
                ChatBoxDTO chatBoxDTO = new ChatBoxDTO();
                chatBoxDTO.setChatRoomId(chatBox.getChatRoom().getId());
                chatBoxDTO.setRoleFromRoleType(chatBox.getRoleFrom().getRoleType());
                chatBoxDTO.setRoleToRoleType(chatBox.getRoleTo().getRoleType());
                chatBoxDTO.setTime(chatBox.getTime());
                chatBoxDTO.setMessage(chatBox.getMessage());
                return chatBoxDTO;
            }).collect(Collectors.toList());
            return chatBoxDTOs;
        }else {
            throw new IllegalArgumentException("ChatRoom not found.");
        }
    }

    @Override
    public void deleteChatRoom(String chatRoomId) {
        Optional<ChatRoom> chatRoomCheck = chatRoomRepository.findById(chatRoomId);
        if (chatRoomCheck.isPresent()){
            chatRoomRepository.delete(chatRoomCheck.get());
        }else {
            throw new IllegalArgumentException("ChatRoom not found.");
        }
    }

}
