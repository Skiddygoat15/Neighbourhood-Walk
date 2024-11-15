"use client"
import { useEffect } from 'react';

export default function UserDetail() {
    useEffect(() => {
        const websocketurl = process.env.WEB_SOCKET_URL;
        const websocket = new WebSocket(`${websocketurl}/ws`);

        websocket.onopen = function() {
            console.log("WebSocket连接成功");

            const token = sessionStorage.getItem('token'); // Getting a Stored Token
            console.info(token);
            if (token) {
                // Send authentication message
                websocket.send(JSON.stringify({
                    type: 'authenticate',
                    token: token
                }));
            } else {
                console.error("未找到令牌");
            }
        };

        // When a WebSocket message is received
        websocket.onmessage = function(event) {
            console.log("收到消息: " + event.data);
        };

        // WebSocket Error Handling
        websocket.onerror = function(event) {
            console.error("WebSocket error observed:", event);
        };

        // WebSocket Connection Closure Handling
        websocket.onclose = function(event) {
            console.log(`WebSocket is closed now. Clean close: ${event.wasClean}, code=${event.code}, reason=${event.reason}`);
        };

        // Cleaning up WebSocket connections when components are uninstalled
        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        };
    }, []); // Executed only when the component is mounted

    return (
        <div className="min-h-screen bg-white p-4">
            <h1>User Detail Page</h1>
        </div>
    );
}