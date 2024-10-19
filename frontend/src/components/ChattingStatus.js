"use client"// components/ChattingStatus.js

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

function ChattingStatus({ name, text, time, parentId, path }) {


    const [role, setRole] = useState("");;
    const router = useRouter();  // 使用 useRouter

    useEffect(()=>{
        setRole(localStorage.getItem("role"));
    },[])

    const goToNotificationChatPage = () => {
        if (role === "parent"){
            router.push(path || `/message-chat-parent`); // Use provided path or default to `/message-chat`
        }else {
            router.push(path || `/message-chat-walker`); // Use provided path or default to `/message-chat`
        }
    };

    const myInit = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
        mode: 'cors',
        cache: 'default'
    };

    const requestURL = new Request(`http://127.0.0.1:8080/WalkerRequest/getWalkerRequestByWalkerId/${parentId}`, myInit);

    fetch(requestURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "Accepted" || data.status === "Rejected" || data.status === "Pending...") {
                setRequestStatus(data.status);
            }})
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    const [requestStatus, setRequestStatus] = useState('Pending...'); // 默认值为 'Pending...'

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Accepted':
                return { color: 'green', fontWeight: 'bold' };
            case 'Rejected':
                return { color: 'red', fontWeight: 'bold' };
            case 'Pending...':
                return { color: 'blue', fontWeight: 'bold' };
            default:
                return { color: 'black', fontWeight: 'bold' };
        }
    };

    return (
        <div onClick={goToNotificationChatPage} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #eee',
            cursor: 'pointer'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: '#ccc',
                marginRight: '10px'
            }}></div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ flexGrow: 1, textAlign: 'left' }}>
                        {name}
                        <span style={getStatusStyle(requestStatus)}>
                            ({requestStatus})
                        </span>
                    </span>
                    <span style={{ flexGrow: 1, textAlign: 'center' }}>{text}</span>
                    <span style={{ flexGrow: 1, textAlign: 'right' }}>{time}</span>
                </div>
            </div>
        </div>
    );
}

export default ChattingStatus;