'use client'

import ChatBar from '../../../components/ChatBar';
import {useEffect, useRef, useState} from "react";
import BackgroundLayout from '../../ui-background-components/BackgroundLayout';
import {useRouter} from "next/navigation";
import {format} from "date-fns";
import { v4 as uuidv4 } from 'uuid';
export default function Home({params}) {


    // ####################################Function 1: Character status detection####################################
    // Role status detection on both sides
    const [roleFrom, setRoleFrom] = useState("walker");
    const [userIdFrom, setUserIdFrom] = useState("");
    const [isDataReady, setIsDataReady] = useState(false);
    const userIdTo = params.userToId;
    const [chatRoomId, setChatRoomId] = useState("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const storedRole = sessionStorage.getItem("roles")?.slice(2, -2);
        const storedUser = sessionStorage.getItem("userId");
        if (storedUser && storedRole) {
            // setRoleFrom(storedRole);
            setRoleFrom("walker");
            setUserIdFrom(storedUser);
            setIsDataReady(true);  // Set the status of data preparation completed
        }
    }, []);
    const roleTo = roleFrom === "walker" ? "parent" : "walker";

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



    // ####################################Function 2: WebSocket server connection####################################
    const websocket = useRef(null);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);  // The state used to store messages
    const [allChatMessages, setAllChatMessages] = useState([]);
    useEffect(() => {
        console.info("messages are:", messages)
    }, [messages]);

    useEffect(() => {
        console.info("allChatMessages are:", allChatMessages)
    }, [allChatMessages]);
    function initializeWebSocket(userIdFrom, userIdTo) {
        websocket.current = new WebSocket(`ws://${apiUrl}/ws`);

        websocket.current.onopen = function () {
            console.log("WebSocket connection successful");
            console.log("userIdFrom is: " + userIdFrom);
            console.log("userIdTo is: " + userIdTo);
            GetChatHistory();
            // setMessages((prev) => [...prev, `user[${username}] Already joined the chat room`]);

            // Obtain and send the userId of both parties in the chat to the server
            if (typeof window !== 'undefined') {
                if (userIdFrom && userIdTo) {
                    const initData = JSON.stringify({
                        type: "init",
                        userIdFrom: userIdFrom,
                        userIdTo: userIdTo,
                    });
                    console.info(initData);
                    websocket.current.send(initData);

                }
            }
            // setMessages((prev) => [...prev, `user1 Already joined the chat room`]);
        };

        websocket.current.onmessage = function (event) {
            try {
                const newMessage = JSON.parse(event.data);
                setAllChatMessages(prevMessages => [...prevMessages, newMessage]);
            } catch (error) {
                console.error("Error parsing message data:", error);
            }
        };

        websocket.current.onerror = function (event) {
            console.error("WebSocket error observed:", event);

        };

        websocket.current.onclose = function (event) {
            console.log(`WebSocket is closed now.`);
            // setMessages((prev) => [...prev, `user1 Have left the chat room`]);
        };

        // Clean up WebSocket connections when components are unloaded
        return () => {
            if (websocket.current.readyState === WebSocket.OPEN) {
                websocket.current.close();
            }
        };
        // }, []);
    }
    // ####################################Function 3: Process sending information####################################
    // Send messages using websocket
    const sendMessage = (inputMessage) => {

        const currentTime = new Date(); // 获取当前时间
        const formattedTime = format(currentTime, "EEEE, MMMM do, yyyy, hh:mm:ss a"); // Format time

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
            alert("WebSocket Connection not established！");
        }
    };

    const getMessageStyle = (roleFromRoleType) => {
        return roleFromRoleType === 'walker' ? 'message-left' : 'message-right';
    };
    function GetChatHistory() {
        const userIdFromLong = parseInt(userIdFrom, 10);
        const userIdToLong = parseInt(userIdTo, 10);
        const chatRoomId = "room_" + Math.min(userIdFromLong, userIdToLong) + "_" + Math.max(userIdFromLong, userIdToLong);
        setChatRoomId(chatRoomId);
        fetch(`http://${apiUrl}/ChatRoom/getChatBoxesFromChatRoom/${chatRoomId}`, {
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
                setAllChatMessages(data);  // Directly update allChatMessages status to the array obtained from the backend
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
                            // backgroundColor: msg.roleFromRoleType === 'walker' ? '#f1f1f1' : '#d1f0f7',
                            backgroundColor: msg.roleFromRoleType === 'walker' ? '#d1f0f7' : '#f1f1f1',
                            textAlign: msg.roleFromRoleType === 'walker' ? 'right' : 'left',
                            float: msg.roleFromRoleType === 'walker' ? 'right' : 'left',
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
            <div className="fixed bottom-16 w-full max-w-[calc(100%-20px)] px-2 mx-auto">
                <ChatBar onSendMessage={sendMessage}/>
            </div>
        </div>
            </BackgroundLayout>
    );
}