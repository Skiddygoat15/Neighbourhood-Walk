'use client'

import ChatBar from '../../../components/ChatBar';
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {format} from "date-fns";
import { v4 as uuidv4 } from 'uuid';
//！！！！！！！！接下来要实现的是：通过主user和他的身份，与副user和他的身份，查找他们之间是否有chatroom（聊天历史记录），如果有，则家
export default function Home({params}) {


    // ####################################功能1:角色状态检测####################################
    // 双方role状态检测
    const [roleFrom, setRoleFrom] = useState("parent");
    const [userIdFrom, setUserIdFrom] = useState("");
    // const [userIdTo, setUserIdTo] = useState("101");
    const [isDataReady, setIsDataReady] = useState(false);
    const userIdTo = params.userToId;

    useEffect(() => {
        const storedRole = localStorage.getItem("roles")?.slice(2, -2);
        const storedUser = localStorage.getItem("userId");
        if (storedUser && storedRole) {
            setRoleFrom("parent");
            setUserIdFrom(storedUser);
            setIsDataReady(true);  // 设置数据准备完毕的状态
        }
    }, []);
    const roleTo = roleFrom === "parent" ? "walker" : "parent";

    useEffect(() => {
        if (isDataReady) {
            console.info("userIdFrom is", userIdFrom)
            console.info("userRoleFrom is", roleFrom)
            console.info("userIdTo is",userIdTo)
            console.info("userRoleFrom is", roleTo)
            initializeWebSocket(userIdFrom, userIdTo);
        }
    }, [isDataReady, userIdFrom, userIdTo]);



    // ####################################功能2:WebSocket服务器连接####################################
    const websocket = useRef(null);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);  // 用于存储消息的状态

    useEffect(() => {
        console.info("messages are:", messages)
    }, [messages]);

    //websocket连接
    // useEffect(() => {
    function initializeWebSocket(userIdFrom, userIdTo) {
        websocket.current = new WebSocket('ws://localhost:8080/ws');

        websocket.current.onopen = function () {
            console.log("WebSocket连接成功");
            console.log("userIdFrom is: " + userIdFrom);
            console.log("userIdTo is: " + userIdTo);
            // setMessages((prev) => [...prev, `用户[${username}] 已经加入聊天室`]);

            // 获取并发送chat双方的userId给服务器
            if (typeof window !== 'undefined') {
                if (userIdFrom && userIdTo) {
                    // 构建要发送的数据

                    const initData = JSON.stringify({
                        type: "init",
                        userIdFrom: userIdFrom,
                        userIdTo: userIdTo,
                    });
                    console.log("已发送initData到服务器");
                    console.info(initData);
                    websocket.current.send(initData);
                }
            }
            // setMessages((prev) => [...prev, `用户1 已经加入聊天室`]);
        };

        // 当接收到 WebSocket 消息时
        websocket.current.onmessage = function (event) {
            console.log("Get message from server: ", event.data);
            // try {
            //     const parsedData = JSON.parse(event.data);
            //     setMessages(prev => [...prev, parsedData]);
            // } catch (error) {
            //     console.error("Error parsing message data:", error);
            // }
        };

        // WebSocket 错误处理
        websocket.current.onerror = function (event) {
            console.error("WebSocket error observed:", event);

        };

        // WebSocket 连接关闭处理
        websocket.current.onclose = function (event) {
            console.log(`WebSocket is closed now.`);
            // setMessages((prev) => [...prev, `用户1 已经离开聊天室`]);
        };

        // 在组件卸载时清理 WebSocket 连接
        return () => {
            if (websocket.current.readyState === WebSocket.OPEN) {
                websocket.current.close();
            }
        };
        // }, []);
    }
    // ####################################功能3:处理发送信息####################################
    // 使用websocket发送消息
    const sendMessage = (inputMessage) => {

        const currentTime = new Date(); // 获取当前时间
        const formattedTime = format(currentTime, "EEEE, MMMM do, yyyy, hh:mm:ss a"); // 格式化时间

        if(websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                const messageData = JSON.stringify({
                    // time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
                        type: "message",
                        userIdFrom: userIdFrom,
                        userIdTo: userIdTo,
                        roleFrom: roleFrom,
                        roleTo: roleTo,
                        message: inputMessage,
                        time: formattedTime,
                    });

                console.info("inputMessage is: " + inputMessage);
                websocket.current.send(messageData);

                setMessages([...messages, messageData]);
            } else {
            alert("WebSocket 连接未建立！");
        }
    };

    const getMessageStyle = (role) => {
        return role === 'walker' ? "message-left" : "message-right";
    };

    return (

        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <div className="messages">
                {messages.map((msg) => (
                    <div key={uuidv4()} className={`message ${getMessageStyle(msg.roleFrom)}`}>
                        {msg.message} <span>{msg.time}</span>
                    </div>
                ))}
            </div>
            <ChatBar onSendMessage={sendMessage}/>
        </div>
    );
}