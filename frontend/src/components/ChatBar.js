// components/ChatBar.js
import React, { useState } from 'react';

export default function ChatBar({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 flex w-full">
            <input
                id="chat-message"
                name="message"
                type="text"
                required
                className="flex-grow rounded-l-md border border-gray-300 bg-white px-3.5 py-2
                shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your message..."
                value={message}
                onChange={handleChange}
            />
            <button
                type="submit"
                className="flex-none rounded-r-md bg-indigo-500 px-3.5 py-2.5
                text-sm font-semibold text-white shadow-sm hover:bg-indigo-400
                focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
                Send
            </button>
        </form>
    );
}

