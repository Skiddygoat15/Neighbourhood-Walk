package com.comp5703.Neighbourhood.Walk.websocket;
import com.comp5703.Neighbourhood.Walk.Entities.*;
import com.comp5703.Neighbourhood.Walk.Repository.ChatBoxRepository;
import com.comp5703.Neighbourhood.Walk.Repository.ChatRoomRepository;
import com.comp5703.Neighbourhood.Walk.Repository.RoleRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Utils.DateConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.*;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Used to manage the conversation content corresponding to the chat room
    private Map<String, List<WebSocketSession>> roomSessions = new HashMap<>();

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ChatBoxRepository chatBoxRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {

        // Read received messages
        System.out.println("Client to server: " + message.getPayload());
        session.sendMessage(new TextMessage("Message from server: " + message.getPayload()));
        JsonReader reader = Json.createReader(new StringReader(message.getPayload()));

        // Convert read data to JsonObject
        JsonObject jsonObject = reader.readObject();
        reader.close();

        // Initialization parameters
        String messageType = jsonObject.getString("type");

        // Parse the message type and process the message
        switch (messageType) {
            case "init":
                String userIdFrom = jsonObject.getString("userIdFrom");
                String userIdTo = jsonObject.getString("userIdTo");
                String roomId = generateRoomId(userIdFrom, userIdTo);

                //存储信息体
                session.getAttributes().put("roomId", roomId);
                session.getAttributes().put("userIdFrom", userIdFrom);
                session.getAttributes().put("userIdTo", userIdTo);

                ChatRoom chatRoom = null;

                Optional<ChatRoom> chatRoomCheck = chatRoomRepository.findById(roomId);

                if (chatRoomCheck.isEmpty()){
                    ChatRoom newRoom = new ChatRoom();
                    newRoom.setId(roomId);
                    chatRoomRepository.save(newRoom);
                    chatRoom = newRoom;
                }else {
                    chatRoom = chatRoomCheck.get();
                }

                // Add a session to the list of rooms
                roomSessions.putIfAbsent(roomId, new ArrayList<>());
                roomSessions.get(roomId).add(session); // Make sure the session is added to the list

                System.out.println("WebSocket has been built, join in the room with id：" + roomId);
                session.sendMessage(new TextMessage("You have joined the room: " + roomId));
                break;

            case "message":
                Object someAttribute = session.getAttributes().get("someKey");
                System.out.println("Session attribute: " + someAttribute);


                roomId = (String) session.getAttributes().get("roomId");
                userIdFrom = (String) session.getAttributes().get("userIdFrom");
                userIdTo = (String) session.getAttributes().get("userIdTo");

                userIdFrom = jsonObject.getString("userIdFrom");
                userIdTo = jsonObject.getString("userIdTo");
                roomId = generateRoomId(userIdFrom, userIdTo);


                // Determine whether a chat room exists
                chatRoom = chatRoomRepository.findById(roomId).orElse(null);
                if (chatRoom == null) {
                    System.out.println("The room ID does not exist and the message cannot be sent");
                    return;
                }

                // Generate and store the message body corresponding to the user message, and the server echoes the message body
                ChatBox chatBoxMessage = handleChatMessage(jsonObject, roomId, userIdFrom, userIdTo, chatRoom);

                // Add new message to chat room
                chatRoom.getChatBoxes().add(chatBoxMessage);

                chatRoomRepository.save(chatRoom);

                ChatBoxDTO chatBoxDTO = new ChatBoxDTO();
                if (chatBoxMessage != null) {
                    if (chatBoxMessage.getRoleFrom() != null) {
                        chatBoxDTO.setRoleFromRoleType(chatBoxMessage.getRoleFrom().getRoleType());
                    }
                    if (chatBoxMessage.getRoleTo() != null) {
                        chatBoxDTO.setRoleToRoleType(chatBoxMessage.getRoleTo().getRoleType());
                    }
                    chatBoxDTO.setMessage(chatBoxMessage.getMessage());
                    chatBoxDTO.setTime(chatBoxMessage.getTime());
                    // Get the ID from the ChatRoom object. It is assumed that the ChatRoom class has a getId method.
                    if (chatBoxMessage.getChatRoom() != null) {
                        chatBoxDTO.setChatRoomId(String.valueOf(chatBoxMessage.getChatRoom().getId()));
                    }
                }

                String chatBoxJson = objectMapper.writeValueAsString(chatBoxDTO);
                // Create a TextMessage
                TextMessage DtoToMessage = new TextMessage(chatBoxJson);
                // Broadcast messages in the room
                broadcastMessage(roomId, DtoToMessage);

                break;
            default:
                System.out.println("Unknown type of message: " + messageType);
        }
    }

    //Room message broadcast
    private void broadcastMessage(String roomId, TextMessage message) {
        //Find the websocket connection corresponding to the room
        List<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    try {
                        s.sendMessage(message);
                    } catch (IOException e) {
                        System.err.println("Failed to send message to session " + s.getId());
                    }
                }
            }
        } else {
            System.out.println("No sessions available in room: " + roomId);
        }
    }

    //Handle chat messages
    private ChatBox handleChatMessage(JsonObject jsonObject, String roomId, String userIdFrom, String userIdTo, ChatRoom chatRoom) {
        //Chat message processing
        String roleFrom = jsonObject.getString("roleFrom");
        String roleTo = jsonObject.getString("roleTo");
        String message = jsonObject.getString("message");
        String time = jsonObject.getString("time");

        System.out.println("############Message############");
        System.out.println("The chat message is: " + message
                + "\n from " + roleFrom + " to " + roleTo +
                "\n in the room of " + roomId + "\n at " + time);


        List<Role> roleFromFinalChecked = null;

        Users userFromFinalChecked = null;
        Optional<Users> userFromFinalCheck = usersRepository.findById(Long.parseLong(userIdFrom));
        if (userFromFinalCheck.isPresent()){
            userFromFinalChecked = userFromFinalCheck.get();
        }else {
            System.out.println("User does not exist");
        }

        List<Role> roleFromFinalCheck = roleRepository.findByUserId(userFromFinalChecked);
        if (roleFromFinalCheck != null){
            roleFromFinalChecked = roleFromFinalCheck;
        }else {

            System.out.println("role does not exist");
        }

        List<Role> roleToFinalChecked = null;

        Users userToFinalChecked = null;
        Optional<Users> userToFinalCheck = usersRepository.findById(Long.parseLong(userIdTo));
        if (userToFinalCheck.isPresent()){
            userToFinalChecked = userToFinalCheck.get();
        }else {
            System.out.println("User does not exist");
        }
        List<Role> roleToFinalCheck = roleRepository.findByUserId(userToFinalChecked);
        if (roleToFinalCheck != null){
            roleToFinalChecked = roleToFinalCheck;
        }else {
            System.out.println("role does not exist");
        }

        //Get and process message sending time
        Date timeFinal = DateConverter.StringToDate(time);

        System.out.println("roleFromFinalChecked is "+roleFromFinalChecked);
        System.out.println("roleToFinalChecked is "+roleToFinalChecked);
        System.out.println("chatRoom is " + chatRoom);
        //Initialize the sender and receiver information in chatRoom
        System.out.println("-------For roleFrom：");
        System.out.println("roleFrom is"+roleFrom);

        Role roleFromFinal = null;
        System.out.println("chatRoom.getRoleFrom() is " + chatRoom.getRoleFrom());

        if (chatRoom.getRoleFrom() == null){
            for (Role role : roleFromFinalChecked) {
                if (role.getRoleType().equals(roleFrom)){
                    roleFromFinal = role;
                    break;
                }
            }
            if (roleFromFinal != null) {
                chatRoom.setRoleFrom(roleFromFinal); // Set only after a match is found
            } else {
                System.out.println("The corresponding identity does not exist");
            }
        }
        else {
            Role tempRoleFrom = null;
            for (Role role : roleFromFinalChecked) {
                if (role.getRoleType().equals(roleFrom)){
                    tempRoleFrom = role;
                    break;
                }
            }
            if (tempRoleFrom != null){
                roleFromFinal = tempRoleFrom;
            }else {
                System.out.println("The corresponding identity does not exist");
            }
        }

        System.out.println("-------For roleTo：");
        System.out.println("roleTo is"+roleTo);

        System.out.println("chatRoom.getRoleTo() is " + chatRoom.getRoleTo());
        Role roleToFinal = null;
        if (chatRoom.getRoleTo() == null){
            for (Role role : roleToFinalChecked) {
                if (role.getRoleType().equals(roleTo)){
                    roleToFinal = role;
                    break;
                }
            }
            if (roleToFinal != null) {
                chatRoom.setRoleTo(roleToFinal); // Set only after a match is found
            } else {
                System.out.println("The corresponding identity does not exist");
            }
        }
        else {
            Role tempRoleTo = null;
            for (Role role : roleToFinalChecked) {
                if (role.getRoleType().equals(roleTo)){
                    tempRoleTo = role;
                    break;
                }
            }
            if (tempRoleTo != null){
                roleToFinal = tempRoleTo;
            }else {
                System.out.println("The corresponding identity does not exist");
            }
        }

        assert roleFromFinal != null;
        System.out.println("The roleFrom is: " + roleFromFinal.getRoleType());
        assert roleToFinal != null;
        System.out.println("The roleTo is: " + roleToFinal.getRoleType());
        //Generate and save chat message body
        ChatBox chatBox = new ChatBox(roleFromFinal,roleToFinal,message,timeFinal,chatRoom);

        return chatBoxRepository.save(chatBox);
    }

    // Generate chat room
    private String generateRoomId(String userIdFrom, String userIdTo) {
        // Logic to generate room ID based on user ID
        return "room_" + Math.min(Long.parseLong(userIdFrom), Long.parseLong(userIdTo)) + "_" + Math.max(Long.parseLong(userIdFrom), Long.parseLong(userIdTo));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("WebSocket connection established");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomId = (String) session.getAttributes().get("roomId");
        if (roomId != null && roomSessions.containsKey(roomId)) {
            roomSessions.get(roomId).remove(session);
        }
        System.out.println("WebSocket connection closed");
    }

}