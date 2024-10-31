'use client'

import ChatBar from '../../../components/ChatBar';
import {useEffect, useRef, useState} from "react";
import {format} from "date-fns";
import BackgroundLayout from '../../ui-background-components/BackgroundLayout';
import { v4 as uuidv4 } from 'uuid';
export default function Home({params}) {


    // ####################################功能1:角色状态检测####################################
    // 双方role状态检测
    const [roleFrom, setRoleFrom] = useState("parent");
    const [userIdFrom, setUserIdFrom] = useState("");
    // const [userIdTo, setUserIdTo] = useState("101");
    const [isDataReady, setIsDataReady] = useState(false);
    const userIdTo = params.userToId;
    const [chatRoomId, setChatRoomId] = useState("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const storedRole = sessionStorage.getItem("roles")?.slice(2, -2);
        const storedUser = sessionStorage.getItem("userId");
        if (storedUser && storedRole) {
            // setRoleFrom(storedRole);
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
            console.info(typeof userIdTo)
            initializeWebSocket(userIdFrom, userIdTo);
        }
    }, [isDataReady, userIdFrom, userIdTo]);



    // ####################################功能2:WebSocket服务器连接####################################
    const websocket = useRef(null);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);  // 用于存储消息的状态
    const [allChatMessages, setAllChatMessages] = useState([]);
    useEffect(() => {
        console.info("messages are:", messages)
    }, [messages]);

    useEffect(() => {
        console.info("allChatMessages are:", allChatMessages)
    }, [allChatMessages]);
    //websocket连接
    // useEffect(() => {
    function initializeWebSocket(userIdFrom, userIdTo) {
        websocket.current = new WebSocket(`ws://${apiUrl}/ws`);

        websocket.current.onopen = function () {
            console.log("WebSocket连接成功");
            console.log("userIdFrom is: " + userIdFrom);
            console.log("userIdTo is: " + userIdTo);
            GetChatHistory();
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
                    console.info(initData);
                    websocket.current.send(initData);

                }
            }
            // setMessages((prev) => [...prev, `用户1 已经加入聊天室`]);
        };
        // 当接收到 WebSocket 消息时
        websocket.current.onmessage = function (event) {
            // console.info("server message test:")
            // console.log(event.data);

            try {
                const newMessage = JSON.parse(event.data);
                setAllChatMessages(prevMessages => [...prevMessages, newMessage]); // 使用函数式更新以保证状态正确更新
            } catch (error) {
                console.error("Error parsing message data:", error);
            }
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


    // const getMessageStyle = (roleFromRoleType) => {
    //     return roleFromRoleType === 'parent' ? 'message-left' : 'message-right';
    // };

    function GetChatHistory() {
        const userIdFromLong = parseInt(userIdFrom, 10);
        const userIdToLong = parseInt(userIdTo, 10);
        const chatRoomId = "room_" + Math.min(userIdFromLong, userIdToLong) + "_" + Math.max(userIdFromLong, userIdToLong);
        setChatRoomId(chatRoomId);
        fetch(`${apiUrl}/ChatRoom/getChatBoxesFromChatRoom/${chatRoomId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token') },
        })
            .then(response => {
                if (!response.ok) {
                    console.info("Failed to get the Chatting history.")
                }else {
                    console.info("Successfully to get the Chatting history.")
                }
                return response.json();
            })
            .then(data =>{
                // console.info("Chatting history is:", data);
                setAllChatMessages(data);  // 直接更新 allChatMessages 状态为从后端获取的数组
            })
            .catch(error => console.error('Error:', error));
    }


    return (
        <BackgroundLayout>
        <div className="flex flex-col h-screen p-4">
            <div className="messages">
                {allChatMessages.map((msg, index) => (
                    <div
                        key={uuidv4()}
                        style={{
                            // backgroundColor: msg.roleFromRoleType === 'parent' ? '#f1f1f1' : '#d1f0f7',
                            backgroundColor: msg.roleFromRoleType === 'parent' ? '#d1f0f7' : '#f1f1f1',
                            textAlign: msg.roleFromRoleType === 'parent' ? 'right' : 'left',
                            float: msg.roleFromRoleType === 'parent' ? 'right' : 'left',
                            clear: 'both',
                            margin: '10px',
                            padding: '10px',
                            borderRadius: '10px',
                            maxWidth: '60%',
                        }}
                    >
                        <p>{msg.message}</p>
                        <span>{new Date(msg.time).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <div className="fixed bottom-16 w-full max-w-[calc(100%-20px)] px-2 mx-auto"> {/* bottom-16 代表向上移动 16px，可以根据需要调整 */}
                <ChatBar onSendMessage={sendMessage}/>
            </div>
            {/*<ChatBar onSendMessage={sendMessage}/>*/}
        </div>
            </BackgroundLayout>
    );
}