"use client"
import React, { useEffect, useState } from 'react';

// NotificationWebSocket 组件：接收通知并通过回调函数将数据传递给父组件
const NotificationWebSocket = ({ onNewNotification }) => {
    useEffect(() => {
        // 创建 WebSocket 连接
        const ws = new WebSocket('ws://localhost:8080/ws/notifications');

        ws.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            console.log('Notification received:', notification);
            // 使用父组件传递的回调函数来处理新通知
            onNewNotification(notification);
        };

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // 在组件卸载时关闭 WebSocket 连接
        // return () => {
        //     ws.close();
        // };
    }, [onNewNotification]);  // 仅在 onNewNotification 回调函数变更时重新运行

    return null;  // 此组件本身不需要渲染任何内容
};

export default NotificationWebSocket;
