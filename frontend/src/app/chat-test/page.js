"use client"
import { useEffect } from 'react';

export default function UserDetail() {
    useEffect(() => {

        const websocket = new WebSocket('ws://localhost:8080/ws');

        websocket.onopen = function() {
            console.log("WebSocket连接成功");

            const token = sessionStorage.getItem('token'); // 获取存储的令牌
            console.info(token);
            if (token) {
                // 发送身份验证消息
                websocket.send(JSON.stringify({
                    type: 'authenticate',
                    token: token
                }));
            } else {
                console.error("未找到令牌");
            }
        };

        // 当接收到 WebSocket 消息时
        websocket.onmessage = function(event) {
            console.log("收到消息: " + event.data);
        };

        // WebSocket 错误处理
        websocket.onerror = function(event) {
            console.error("WebSocket error observed:", event);
        };

        // WebSocket 连接关闭处理
        websocket.onclose = function(event) {
            console.log(`WebSocket is closed now. Clean close: ${event.wasClean}, code=${event.code}, reason=${event.reason}`);
        };

        // 在组件卸载时清理 WebSocket 连接
        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        };
    }, []); // 仅在组件挂载时执行

    return (
        <div className="min-h-screen bg-white p-4">
            <h1>User Detail Page</h1>
        </div>
    );
}