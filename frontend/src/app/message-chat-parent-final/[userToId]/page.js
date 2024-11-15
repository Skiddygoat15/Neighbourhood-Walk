'use client'

import ChatBar from '../../../components/ChatBar';
import {useEffect, useRef, useState} from "react";
import {format} from "date-fns";
import BackgroundLayout from '../../ui-background-components/BackgroundLayout';
import { v4 as uuidv4 } from 'uuid';

export default function Home({params}) {

    // ####################################Function 1: Character status detection####################################
    // Role status detection on both sides
    const [roleFrom, setRoleFrom] = useState("parent");
    const [userIdFrom, setUserIdFrom] = useState("");
    const [isDataReady, setIsDataReady] = useState(false);
    const userIdTo = params.userToId;
    const [chatRoomId, setChatRoomId] = useState("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const websocketurl = process.env.NEXT_PUBLIC_WS_URL;
    useEffect(() => {
        const storedRole = sessionStorage.getItem("roles")?.slice(2, -2);
        const storedUser = sessionStorage.getItem("userId");
        if (storedUser && storedRole) {
            setRoleFrom("parent");
            setUserIdFrom(storedUser);
            setIsDataReady(true);  // Set the status of data preparation completed
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


    // ####################################Function 2: WebSocket server connection####################################
    const websocket = useRef(null);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);  // Used to store the state of the message
    const [allChatMessages, setAllChatMessages] = useState([]);
    useEffect(() => {
        console.info("messages are:", messages)
    }, [messages]);

    useEffect(() => {
        console.info("allChatMessages are:", allChatMessages)
    }, [allChatMessages]);

    function initializeWebSocket(userIdFrom, userIdTo) {
        websocket.current = new WebSocket(`${websocketurl}/ws`);
        websocket.current.onopen = function () {
            console.log("WebSocket connection successful");
            console.log("userIdFrom is: " + userIdFrom);
            console.log("userIdTo is: " + userIdTo);
            GetChatHistory();

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
        };
        websocket.current.onmessage = function (event) {

            try {
                const newMessage = JSON.parse(event.data);
                setAllChatMessages(prevMessages => [...prevMessages, newMessage]); // Use functional updates to ensure state is updated correctly
            } catch (error) {
                console.error("Error parsing message data:", error);
            }
        };

        // WebSocket Error handling
        websocket.current.onerror = function (event) {
            console.error("WebSocket error observed:", event);

        };

        // WebSocket Connection close processing
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
    const sendMessage = (inputMessage) => {

        const currentTime = new Date();
        const formattedTime = format(currentTime, "EEEE, MMMM do, yyyy, hh:mm:ss a");

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
                <div className="fixed bottom-16 w-full max-w-[calc(100%-20px)] px-2 mx-auto">
                    <ChatBar onSendMessage={sendMessage}/>
                </div>
            </div>
        </BackgroundLayout>
    );
}