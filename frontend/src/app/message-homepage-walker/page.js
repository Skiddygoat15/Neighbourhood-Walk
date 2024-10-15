'use client'

import Head from 'next/head'
import ChattingStatus from "@/components/ChattingStatus";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';


export default function Home() {
    const textColor = useTextColor();

    const token = localStorage.getItem('token');
    console.info("token=" + token)
    const users = ['Emma', 'Ava', 'Sophia', 'Amelia'];
    const path = '../message-chat-walker'
    const messages = [
        { name: 'Abigail', text: 'Accept', time: '23 min', parentId: '1'},
        { name: 'Elizabeth', text: 'Ok, see you then.', time: '27 min', parentId: '2'},
        { name: 'Penelope', text: 'You: Hey! What\'s up, long time.', time: '33 min', parentId: '3'},
        { name: 'Chloe', text: 'You: Hello how are you?', time: '50 min', parentId: '4'}
    ];

    const router = useRouter();  // 使用 useRouter

    return (
        <BackgroundLayout>
            <div className="max-w-lg w-11/12 rounded-lg py-4 flex items-center mt-4 mx-auto">
                <h1 className={`text-center w-full text-xl font-semibold ${textColor}`}>Messages</h1>
            </div>
            {/* 主体内容容器 */}
            <div style={{
                maxWidth: '900px',
                margin: '20px auto',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <Head>
                    <title>Notifications</title>
                    <meta name="description" content="Notification page"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                {/*<div style={{*/}
                {/*    textAlign: 'center',*/}
                {/*    padding: '10px 0',*/}
                {/*    fontSize: '12px',*/}
                {/*    color: '#666',*/}
                {/*    position: 'sticky',*/}
                {/*    top: 0,*/}
                {/*    zIndex: 1000*/}
                {/*}}*/}
                {/*</div>*/}

                {/*<button onClick={goToNotificationPage} style={{*/}
                {/*    padding: '8px 16px',*/}
                {/*    background: '#0070f3',*/}
                {/*    color: 'white',*/}
                {/*    borderRadius: '8px',*/}
                {/*    cursor: 'pointer',*/}
                {/*    border: 'none',*/}
                {/*    fontSize: '14px'*/}
                {/*}}>*/}
                {/*    Go to My Notification*/}
                {/*</button>*/}
                <div style={{margin: '10px 0'}}>
                    <input type="text" placeholder="Search notifications..." style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxSizing: 'border-box'
                    }}/>
                </div>

                <h2>Recently Chat</h2>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {users.map(user => (
                        <div key={user} style={{textAlign: 'center'}}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '20px',
                                backgroundColor: '#ccc',
                                marginBottom: '10px'
                            }}></div>
                            {user}
                        </div>
                    ))}
                </div>
                <h2>Messages</h2>

                <div style={{marginTop: '20px'}}>
                    {messages.map(msg =>
                        <ChattingStatus key={msg.name}
                                        name={msg.name}
                                        parentId={msg.parentId}
                                        text={msg.text}
                                        time={msg.time}
                                        path={path}
                        />)}
                </div>
            </div>
        </BackgroundLayout>
    );
};