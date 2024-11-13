'use client'

import ChatBar from '../../components/ChatBar';
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {format} from "date-fns";


export default function Home() {

    const router = useRouter();
    // ####################################Function 1: Character status detection####################################
    // Role status detection on both sides
    const [roleFrom, setRoleFrom] = useState("");
    const [userIdFrom, setUserIdFrom] = useState("");
    const [userIdTo, setUserIdTo] = useState("5");
    const [isDataReady, setIsDataReady] = useState(false);
    const websocketurl = process.env.WEB_SOCKET_URL;
    useEffect(() => {
        let storedRole = null;
        let storedUser = null;
        if (typeof window !== 'undefined' && window.sessionStorage) {
            storedRole = sessionStorage.getItem("roles")?.slice(2, -2);
            storedUser = sessionStorage.getItem("userId");
        }
        if (storedUser && storedRole) {
            setRoleFrom(storedRole);
            setUserIdFrom(storedUser);
            setIsDataReady(true);  // Set the status of data preparation completed
        }
    }, []);
    const roleTo = roleFrom === "walker" ? "parent" : "walker";

    useEffect(() => {
        if (isDataReady) {
            initializeWebSocket(userIdFrom);
        }
    }, [isDataReady, userIdFrom]);
    // ####################################Function 2: WebSocket server connection####################################
    const websocket = useRef(null);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);// Used to store the status of the message

    // websocket connection
    function initializeWebSocket(userIdFrom) {
        websocket.current = new WebSocket(`${websocketurl}/ws`);

        websocket.current.onopen = function () {
            console.log("WebSocket Connection successful");
            console.log("userIdFrom is: " + userIdFrom);

            // Obtain and send the userId of both parties in the chat to the server
            if (typeof window !== 'undefined') {
                if (userIdFrom) {
                    // Build the data to send
                    const initData = JSON.stringify({
                        type: "init",
                        userIdFrom: userIdFrom,
                        userIdTo: userIdTo,
                    });
                    console.log("initData sent to server");
                    console.info(initData);
                    websocket.current.send(initData);
                }
            }
            setMessages((prev) => [...prev, `User 1 has joined the chat room`]);
        };

        // When a WebSocket message is received
        websocket.current.onmessage = function (event) {
            console.log("Get message from server: ", event.data);
            try {
                const parsedData = JSON.parse(event.data);
                setMessages(prev => [...prev, parsedData]);
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
            setMessages((prev) => [...prev, `User 1 has left the chat room`]);
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

        const currentTime = new Date(); // Get current time
        const formattedTime = format(currentTime, "EEEE, MMMM do, yyyy, hh:mm:ss a"); // Format time



        if(websocket.current && websocket.current.readyState === WebSocket.OPEN) {
            const messageData = JSON.stringify({
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

        } else {
            alert("WebSocket Connection not established！");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
                <ChatBar onSendMessage={sendMessage}/>
            <div className="py-2">
                <input type="text" placeholder="Do you want to pre-meet?" className="form-input w-full p-3 rounded-md"/>
            </div>
        </div>
    );
}