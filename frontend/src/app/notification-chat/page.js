'use client'

import ChatBar from '../../components/ChatBar';
import RequestBox from '../../components/RequestBox';
import Header from '../../components/Header';
import TimeBar from "@/components/TimeBar";


export default function Home() {
    const handleSendMessage = (message) => {
        console.log("Message sent:", message); // 实际项目中，这里可以是调用 API 发送消息
    };
    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">

            <Header title="Emma-parent" navigateTo={"/notification-homepage"}/>

            <div className="flex-1 overflow-y-auto">
                <TimeBar time={"Today"}/>
                <RequestBox walkerId={2}/>
                <div className="p-4 flex items-center">
                    <div
                        className="rounded-full bg-black w-10 h-10 text-white flex items-center justify-center mr-2">P
                    </div>
                    <div className="flex flex-col">
                        <div className="text-sm bg-gray-300 p-2 rounded-md">Sent my request</div>
                        <div className="text-xs text-gray-500">Today 11:05</div>
                    </div>
                </div>
                <ChatBar onSendMessage={handleSendMessage}/>
            </div>

            <div className="py-2">
                <input type="text" placeholder="Do you want to pre-meet?" className="form-input w-full p-3 rounded-md"/>
            </div>
        </div>
    );
}