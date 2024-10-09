package com.comp5703.Neighbourhood.Walk.websocket;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // 处理收到的消息
        System.out.println("收到消息：" + message.getPayload());
        session.sendMessage(new TextMessage("消息已收到"));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 连接建立时
        System.out.println("WebSocket连接已建立");
        session.sendMessage(new TextMessage("欢迎连接WebSocket"));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 连接关闭时
        System.out.println("WebSocket连接已关闭");
    }
}