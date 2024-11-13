package com.comp5703.Neighbourhood.Walk.config;

import com.comp5703.Neighbourhood.Walk.websocket.MyWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private MyWebSocketHandler myWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Allow WebSocket cross-domain for specified origins
        registry.addHandler(myWebSocketHandler, "/ws")
                .setAllowedOrigins("http://localhost:3000", "http://54.253.215.126","https://54.253.215.126","https://neighbourhood-walk-test.publicvm.com", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004");
    }

}