'use client'

import ChatBar from '../../components/ChatBar';
import RequestBox from '../../components/RequestBox';
import Header from '../../components/Header';
import TimeBar from "@/components/TimeBar";
import ChatMessage from "@/components/ChatFigure";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";


export default function Home() {

    const router = useRouter();
    // const { parentId } = router.query;

    // useEffect(() => {
    //     if (parentId) {
    //         console.log(`Parent ID: ${parentId}`);
    //         // 在此处可以进行与 parentId 相关的逻辑
    //     }
    // }, [parentId]);

    // role 状态可以是 'parent' 或 'walker'
    const [role, setRole] = useState('parent');

    const [messages, setMessages] = useState([
        { id: 1, text: "Sent my request", time: "Today 11:05", from: "parent" },
        { id: 2, text: "Accept", time: "Today 11:25", from: "walker" }
    ]);

    const handleSendMessage = (message) => {

        const newMessage = {
            id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
            text: message,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            from: role
        };

        setMessages([...messages, newMessage]);
        console.log("Message sent:", message); // 实际项目中，这里可以是调用 API 发送消息
    };

    const getMessageStyle = (messageFrom) => {
        if ((role === 'parent' && messageFrom === 'walker') || (role === 'walker' && messageFrom === 'parent')) {
            return "justify-end"; // 将头像放在右边
        } else {
            return "justify-start"; // 将头像放在左边
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <Header title="Emma-parent" navigateTo={"/message-homepage"}/>
            <div className="flex-1 overflow-y-auto">
                <TimeBar time={"Today"}/>
                <RequestBox walkerId={2}/>
                <div className="flex flex-col p-4">
                    {messages.map(message => (
                        <div key={message.id} className={`flex items-center ${getMessageStyle(message.from)}`}>
                            <ChatMessage
                                initials={message.from.charAt(0).toUpperCase()}
                                message={message.text}
                                time={message.time}
                                backgroundColor={message.from === 'parent' ? 'bg-blue-500' : 'bg-black'}
                            />
                        </div>
                    ))}
                </div>
                <ChatBar onSendMessage={handleSendMessage}/>
            </div>

            <div className="py-2">
                <input type="text" placeholder="Do you want to pre-meet?" className="form-input w-full p-3 rounded-md"/>
            </div>
        </div>
        // <p>Post: {parentId}</p>
    );
}