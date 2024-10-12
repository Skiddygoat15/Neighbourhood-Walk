'use client'

import ChatBar from '../../components/ChatBar';
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {format} from "date-fns";


export default function Home() {

    const router = useRouter();
    // const { parentId } = router.query;

    // useEffect(() => {
    //     if (parentId) {
    //         console.log(`Parent ID: ${parentId}`);
    //         // 在此处可以进行与 parentId 相关的逻辑
    //     }
    // }, [parentId]);

    // ####################################功能1:角色状态检测####################################
    // 双方role状态检测
    const [roleFrom, setRoleFrom] = useState("");
    const [userIdFrom, setUserIdFrom] = useState("");
    const [userIdTo, setUserIdTo] = useState(1);

    useEffect(() => {
        // 在 useEffect 中，代码只会在客户端执行
        if (typeof window !== 'undefined') {
            const storedRole = localStorage.getItem("roles").slice(2,-2);
            const storedUser = localStorage.getItem("userId");
            setRoleFrom(storedRole);
            setUserIdFrom(storedUser);
        }
    }, []);

    const roleTo = roleFrom === "walker" ? "parent" : "walker";

    // console.info("role of the main chatter is " + roleFrom);
    // console.info("role of the other chatter is " + roleTo);




    // ####################################功能2:WebSocket服务器连接####################################
    const websocket = useRef(null);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);  // 用于存储消息的状态
    // const handleSendMessage = (message) => {
    //
    //     const newMessage = {
    //         id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
    //         text: message,
    //         time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    //         from: role
    //     };
    //
    //     setMessages([...messages, newMessage]);
    //     console.log("Message sent:", message); // 实际项目中，这里可以是调用 API 发送消息
    // };

    //websocket连接
    useEffect(() => {
        websocket.current = new WebSocket('ws://localhost:8080/ws');

        websocket.current.onopen = function() {
            console.log("WebSocket连接成功");
            // setMessages((prev) => [...prev, `用户[${username}] 已经加入聊天室`]);
            setMessages((prev) => [...prev, `用户1 已经加入聊天室`]);
        };

        // 当接收到 WebSocket 消息时
        websocket.current.onmessage = function(event) {
            // console.log("收到消息: " + event.data);
            // setMessages((prev) => [...prev, event.data]);
            // const newMessage = JSON.parse(event.data); // 假设服务器发送的是JSON字符串
            // setMessages(prevMessages => [...prevMessages, newMessage]);
            console.log("收到消息: ", event.data);
            try {
                const parsedData = JSON.parse(event.data);
                setMessages(prev => [...prev, parsedData]);
            } catch (error) {
                console.error("Error parsing message data:", error);
            }
        };

        // WebSocket 错误处理
        websocket.current.onerror = function(event) {
            console.error("WebSocket error observed:", event);

        };

        // WebSocket 连接关闭处理
        websocket.current.onclose = function(event) {
            console.log(`WebSocket is closed now.`);
            setMessages((prev) => [...prev, `用户1 已经离开聊天室`]);
        };

        // 在组件卸载时清理 WebSocket 连接
        return () => {
            if (websocket.current.readyState === WebSocket.OPEN) {
                websocket.current.close();
            }
        };
    }, []);

    // ####################################功能3:处理发送信息####################################
    // 使用websocket发送消息
    const sendMessage = (inputMessage) => {

        const currentTime = new Date(); // 获取当前时间
        const formattedTime = format(currentTime, "EEEE, MMMM do, yyyy, hh:mm:ss a"); // 格式化时间



        if(websocket.current && websocket.current.readyState === WebSocket.OPEN) {
            const messageData = JSON.stringify({
                // time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
                    userIdFrom: userIdFrom,
                    userIdTo: userIdTo,
                    roleFrom: roleFrom,
                    roleTo: roleTo,
                    message: inputMessage,
                    time: formattedTime,
                });
            console.info("inputMessage is: " + inputMessage);
            websocket.current.send(messageData);

            // websocket.current.send(JSON.stringify({ message: inputMessage }));
            // setInputMessage(""); // Clear the input after sending
            // setMessages((prevMessages) => [...prevMessages, { id: prevMessages.length + 1, text: message, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), from: role }]);
        } else {
            alert("WebSocket 连接未建立！");
        }
    };
    // const sendMessage = (message) => {
    //     if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
    //         websocket.current.send(JSON.stringify({ message: message }));
    //         setInputMessage(""); // Clear the input after sending
    //         setMessages((prevMessages) => [...prevMessages, { id: prevMessages.length + 1, text: message, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), from: role }]);
    //     } else {
    //         alert("WebSocket 连接未建立！");
    //     }
    // };

    // !!!!!!!!!!!!!!!!!!!!!!!!!还需使用
    //
    // const getMessageStyle = (messageFrom) => {
    //     if ((role === 'parent' && messageFrom === 'walker') || (role === 'walker' && messageFrom === 'parent')) {
    //         return "justify-end"; // 将头像放在右边
    //     } else {
    //         return "justify-start"; // 将头像放在左边
    //     }
    // };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            {/*<Header title="Emma-parent" navigateTo={"/message-homepage-walker"}/>*/}
            {/*<div className="flex-1 overflow-y-auto">*/}
            {/*    <TimeBar time={"Today"}/>*/}
            {/*    <RequestBox walkerId={2}/>*/}
            {/*    <div className="flex flex-col p-4">*/}
            {/*        {messages.map(message => (*/}
            {/*            <div key={message.id} className={`flex items-center ${getMessageStyle(message.from)}`}>*/}
            {/*                <ChatMessage*/}
            {/*                    initials={message.from.charAt(0).toUpperCase()}*/}
            {/*                    message={message.text}*/}
            {/*                    time={message.time}*/}
            {/*                    backgroundColor={message.from === 'parent' ? 'bg-blue-500' : 'bg-black'}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}

                <ChatBar onSendMessage={sendMessage}/>

                {/*<input*/}
                {/*    type="text"*/}
                {/*    value={inputMessage}*/}
                {/*    onChange={(e) => setInputMessage(e.target.value)}*/}
                {/*/>*/}
                {/*<button onClick={sendMessage}>发送消息</button>*/}
            {/*</div>*/}

            <div className="py-2">
                <input type="text" placeholder="Do you want to pre-meet?" className="form-input w-full p-3 rounded-md"/>
            </div>
        </div>
        // <p>Post: {parentId}</p>
    );
}