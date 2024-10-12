package com.comp5703.Neighbourhood.Walk.websocket;
import com.comp5703.Neighbourhood.Walk.Entities.ChatBox;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.ChatBoxRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Utils.DateConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.Date;
import java.util.Optional;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ChatBoxRepository chatBoxRepository;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // 处理收到的消息
        System.out.println("Client to server" + message.getPayload());
        session.sendMessage(new TextMessage("Message from server" + message.getPayload()));

//        处理websocket服务器收听到的客户端信息
        // 使用StringReader来读取字符串
        JsonReader reader = Json.createReader(new StringReader(message.getPayload()));

        // 将读取的数据转换为JsonObject
        JsonObject jsonObject = reader.readObject();

        // 关闭reader
        reader.close();

        // 从JsonObject中获取数据
        String userIdFrom = jsonObject.getString("userIdFrom");
        String userIdTo = jsonObject.getString("userIdTo");
        String roleFrom = jsonObject.getString("roleFrom");
        String roleTo = jsonObject.getString("roleTo");
        String messageContent = jsonObject.getString("message");
        String time = jsonObject.getString("time");

        // 打印获取到的数据
        System.out.println("UserId From: " + userIdFrom);
        System.out.println("UserId To: " + userIdTo);
        System.out.println("Role From: " + roleFrom);
        System.out.println("Role To: " + roleTo);
        System.out.println("Message: " + messageContent);
        System.out.println("Time: " + time);

        //获取发送方用户角色信息
        Role roleFromFinal = new Role();
        roleFromFinal.setRoleType(roleFrom);

        Optional<Users> userFromCheck = usersRepository.findById(Long.parseLong(userIdFrom));
        if (userFromCheck.isPresent()){
            roleFromFinal.setUser(userFromCheck.get());
        }else {
            System.out.println("用户不存在");
        }

        //获取接收方用户角色信息
        Role roleToFinal = new Role();
        roleFromFinal.setRoleType(roleTo);

        Optional<Users> userToCheck = usersRepository.findById(Long.parseLong(userIdTo));
        if (userToCheck.isPresent()){
            roleToFinal.setUser(userToCheck.get());
        }else {
            System.out.println("用户不存在");
        }

        //获取并处理信息发送时间
        Date timeFinal = DateConverter.StringToDate(time);

        //生成聊天信息体
        ChatBox chatBox = new ChatBox(roleFromFinal,roleToFinal,messageContent, timeFinal);
        chatBoxRepository.save(chatBox);
//        chatBox.setContent(message.getPayload());
//        messageRepository.save(msg);
//        session.sendMessage(new TextMessage("消息已收到"));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 连接建立时
        System.out.println("WebSocket连接已建立");
//        session.sendMessage(new TextMessage("欢迎连接WebSocket"));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 连接关闭时
        System.out.println("WebSocket连接已关闭");
    }
}