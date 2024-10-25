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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.*;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    //用于管理聊天室对应的会话内容
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

        // 读取收到的消息
        System.out.println("Client to server: " + message.getPayload());
        session.sendMessage(new TextMessage("Message from server: " + message.getPayload()));
        JsonReader reader = Json.createReader(new StringReader(message.getPayload()));

        // 将读取的数据转换为JsonObject
        JsonObject jsonObject = reader.readObject();
        reader.close();

        //初始化参数
        String messageType = jsonObject.getString("type");

        //解析消息类型，并处理消息
        switch (messageType) {
            case "init":
                String userIdFrom = jsonObject.getString("userIdFrom");
                String userIdTo = jsonObject.getString("userIdTo");
                String roomId = generateRoomId(userIdFrom, userIdTo);

                //存储信息体
                session.getAttributes().put("roomId", roomId);
                session.getAttributes().put("userIdFrom", userIdFrom);
                session.getAttributes().put("userIdTo", userIdTo);

//                ChatRoom chatRoom = chatRoomRepository.findById(roomId)
//                        .orElseGet(() -> {
//                            // 聊天室不存在，创建新的聊天室
//                            ChatRoom newRoom = new ChatRoom();
//                            newRoom.setId(roomId);
//                            chatRoomRepository.save(newRoom);
//                            return newRoom;
//                        });
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

                // 加入会话到房间的列表
                roomSessions.putIfAbsent(roomId, new ArrayList<>());
                roomSessions.get(roomId).add(session); // 确保会话被添加到列表中

                System.out.println("WebSocket has been built, join in the room with id：" + roomId);
                session.sendMessage(new TextMessage("You have joined the room: " + roomId));
                break;

            case "message":
                //获取信息体
                // 输出会话的属性
                Object someAttribute = session.getAttributes().get("someKey");
                System.out.println("Session attribute: " + someAttribute);


                roomId = (String) session.getAttributes().get("roomId");
                userIdFrom = (String) session.getAttributes().get("userIdFrom");
                userIdTo = (String) session.getAttributes().get("userIdTo");

//                roomId = (String) session.getAttributes().get("roomId");
//                userIdFrom = (String) session.getAttributes().get("userIdFrom");
//                userIdTo = (String) session.getAttributes().get("userIdTo");

                userIdFrom = jsonObject.getString("userIdFrom");
                userIdTo = jsonObject.getString("userIdTo");
                roomId = generateRoomId(userIdFrom, userIdTo);


                //判断是否存在聊天室
                chatRoom = chatRoomRepository.findById(roomId).orElse(null);
                if (chatRoom == null) {
                    System.out.println("房间ID不存在，无法发送消息");
                    return;
                }

                //生成并存储用户消息对应的消息体，服务器回显消息体
                ChatBox chatBoxMessage = handleChatMessage(jsonObject, roomId, userIdFrom, userIdTo, chatRoom);

                // 将新消息添加到聊天室
                chatRoom.getChatBoxes().add(chatBoxMessage);

                chatRoomRepository.save(chatRoom);

                ChatBoxDTO chatBoxDTO = new ChatBoxDTO();
                if (chatBoxMessage != null) {
                    // 从Role对象中获取roleType
                    if (chatBoxMessage.getRoleFrom() != null) {
                        chatBoxDTO.setRoleFromRoleType(chatBoxMessage.getRoleFrom().getRoleType());
                    }
                    if (chatBoxMessage.getRoleTo() != null) {
                        chatBoxDTO.setRoleToRoleType(chatBoxMessage.getRoleTo().getRoleType());
                    }
                    chatBoxDTO.setMessage(chatBoxMessage.getMessage());
                    chatBoxDTO.setTime(chatBoxMessage.getTime());
                    // 从ChatRoom对象中获取ID，这里假设ChatRoom类有getId方法
                    if (chatBoxMessage.getChatRoom() != null) {
                        chatBoxDTO.setChatRoomId(String.valueOf(chatBoxMessage.getChatRoom().getId()));
                    }
                }

                String chatBoxJson = objectMapper.writeValueAsString(chatBoxDTO);
                // 创建一个 TextMessage
                TextMessage DtoToMessage = new TextMessage(chatBoxJson);
                //房间内广播消息
                broadcastMessage(roomId, DtoToMessage);

                break;
            default:
                System.out.println("Unknown type of message: " + messageType);
        }
//        chatBox.setContent(message.getPayload());
//        messageRepository.save(msg);
//        session.sendMessage(new TextMessage("消息已收到"));
    }

    //房间消息广播
    private void broadcastMessage(String roomId, TextMessage message) {
        //寻找到room对应的websocket连接（这里默认一个房间会出现多个websocket连接，为未来实现群聊功能提供可能）
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

    //处理聊天消息
    private ChatBox handleChatMessage(JsonObject jsonObject, String roomId, String userIdFrom, String userIdTo, ChatRoom chatRoom) {
        //聊天消息处理
        String roleFrom = jsonObject.getString("roleFrom");
        String roleTo = jsonObject.getString("roleTo");
        String message = jsonObject.getString("message");
        String time = jsonObject.getString("time");

        System.out.println("############Message############");
        System.out.println("The chat message is: " + message
                + "\n from " + roleFrom + " to " + roleTo +
                "\n in the room of " + roomId + "\n at " + time);

        //聊天消息存储
        //获取发送方用户角色信息
//        Role roleFromFinalChecked = null;
//
//        Optional<Role> roleFromFinalCheck = roleRepository.findById(Long.parseLong(userIdFrom));
//        if (roleFromFinalCheck.isPresent()){
//            roleFromFinalChecked = roleFromFinalCheck.get();
//        }else {
//            System.out.println("用户不存在");
//        }
//        //获取接收方用户角色信息
//        Role roleToFinalChecked = null;
//
//        Optional<Role> roleToFinalCheck = roleRepository.findById(Long.parseLong(userIdTo));
//        if (roleToFinalCheck.isPresent()){
//            roleToFinalChecked = roleToFinalCheck.get();
//        }else {
//            System.out.println("用户不存在");
//        }

        List<Role> roleFromFinalChecked = null;

        Users userFromFinalChecked = null;
        Optional<Users> userFromFinalCheck = usersRepository.findById(Long.parseLong(userIdFrom));
        if (userFromFinalCheck.isPresent()){
            userFromFinalChecked = userFromFinalCheck.get();
        }else {
            System.out.println("用户不存在");
        }

        List<Role> roleFromFinalCheck = roleRepository.findByUserId(userFromFinalChecked);
        if (roleFromFinalCheck != null){
            roleFromFinalChecked = roleFromFinalCheck;
        }else {

            System.out.println("用户不存在");
        }
        //获取接收方用户角色信息

        List<Role> roleToFinalChecked = null;

        Users userToFinalChecked = null;
        Optional<Users> userToFinalCheck = usersRepository.findById(Long.parseLong(userIdTo));
        if (userToFinalCheck.isPresent()){
            userToFinalChecked = userToFinalCheck.get();
        }else {
            System.out.println("用户不存在");
        }
        List<Role> roleToFinalCheck = roleRepository.findByUserId(userToFinalChecked);
        if (roleToFinalCheck != null){
            roleToFinalChecked = roleToFinalCheck;
        }else {
            System.out.println("角色不存在");
        }


        //获取并处理信息发送时间
        Date timeFinal = DateConverter.StringToDate(time);


        //初始化chatRoom中发送方与接收方信息
        // (roleFrom和roleTo理论上没有区别，但这里规定roleFrom是于此房间中首次发出消息的用户；roleTo是于此房间中首次发出消息的用户)
//        if (chatRoom.getRoleFrom() == null){
//            chatRoom.setRoleFrom(roleFromFinalChecked);
//        }
//        if (chatRoom.getRoleTo() == null){
//            chatRoom.setRoleTo(roleToFinalChecked);
//        }
//
//        //生成并保存聊天信息体
//        ChatBox chatBox = new ChatBox(roleFromFinalChecked,roleToFinalChecked,message,timeFinal,chatRoom);

        System.out.println("roleFromFinalChecked is "+roleFromFinalChecked);
        System.out.println("roleToFinalChecked is "+roleToFinalChecked);
        System.out.println("chatRoom is " + chatRoom);
        //初始化chatRoom中发送方与接收方信息
        // (roleFrom和roleTo理论上没有区别，但这里规定roleFrom是于此房间中首次发出消息的用户；roleTo是于此房间中首次发出消息的用户)
        System.out.println("-------对于roleFrom：");
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
                chatRoom.setRoleFrom(roleFromFinal); // 仅在找到匹配项后设置
            } else {
                System.out.println("对应身份不存在");
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
                System.out.println("对应身份不存在");
            }
        }

        System.out.println("-------对于roleTo：");
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
                chatRoom.setRoleTo(roleToFinal); // 仅在找到匹配项后设置
            } else {
                System.out.println("对应身份不存在");
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
                System.out.println("对应身份不存在");
            }
        }

//        if (chatRoom.getRoleTo() == null){
//            chatRoom.setRoleTo(roleToFinalChecked);
//        }
        assert roleFromFinal != null;
        System.out.println("The roleFrom is: " + roleFromFinal.getRoleType());
        assert roleToFinal != null;
        System.out.println("The roleTo is: " + roleToFinal.getRoleType());
        //生成并保存聊天信息体
        ChatBox chatBox = new ChatBox(roleFromFinal,roleToFinal,message,timeFinal,chatRoom);


        return chatBoxRepository.save(chatBox);
    }

    //生成聊天室
    private String generateRoomId(String userIdFrom, String userIdTo) {
        // 根据用户 ID 生成房间 ID 的逻辑
        return "room_" + Math.min(Long.parseLong(userIdFrom), Long.parseLong(userIdTo)) + "_" + Math.max(Long.parseLong(userIdFrom), Long.parseLong(userIdTo));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 连接建立时
        // 假设从客户端接收到userIdFrom和userIdTo并生成房间ID
        System.out.println("WebSocket连接已建立");
//        session.sendMessage(new TextMessage("欢迎连接WebSocket"));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 连接关闭时
        String roomId = (String) session.getAttributes().get("roomId");
        if (roomId != null && roomSessions.containsKey(roomId)) {
            roomSessions.get(roomId).remove(session);
        }
        System.out.println("WebSocket连接已关闭");
    }

}