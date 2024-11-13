"use client"

function ChatMessage({ initials, message, time, backgroundColor = 'bg-black' }) {
    return (
        <div className="p-4 flex items-center">
            <div className={`rounded-full ${backgroundColor} w-10 h-10 text-white flex items-center justify-center mr-2`}>
                {initials}
            </div>
            <div className="flex flex-col">
                <div className="text-sm bg-gray-300 p-2 rounded-md">{message}</div>
                <div className="text-xs text-gray-500">{time}</div>
            </div>
        </div>
    );
}

export default ChatMessage;