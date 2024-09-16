'use client'

import Head from 'next/head'
import ChattingStatus from "@/components/ChattingStatus";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
    const userId = localStorage.getItem('userId'); // 假设的用户ID，你需要根据你的应用逻辑来获取或定义这个值
    // 假设的用户数据
    console.info("userId="+userId)
    const token = localStorage.getItem('token');
    console.info("token="+token)
    const users = ['Emma', 'Ava', 'Sophia', 'Amelia'];

    const messages = [
        { name: 'Abigail', text: 'Accept', time: '23 min', parentId: '1'},
        { name: 'Elizabeth', text: 'Ok, see you then.', time: '27 min', parentId: '2'},
        { name: 'Penelope', text: 'You: Hey! What\'s up, long time.', time: '33 min', parentId: '3'},
        { name: 'Chloe', text: 'You: Hello how are you?', time: '50 min', parentId: '4'}
    ];

    const router = useRouter();  // 使用 useRouter

    return (
        <div style={{padding: 20, backgroundColor: '#fff', minHeight: '100vh'}}>
            <Head>
                <title>Notifications</title>
                <meta name="description" content="Notification page"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <div style={{
                textAlign: 'center',
                padding: '10px 0',
                fontSize: '12px',
                color: '#666',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>9:41
            </div>
            <h1 style={{color: '#333', fontSize: '24px', margin: '20px 0'}}>Messages</h1>
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
            <div style={{margin: '10px 20px'}}>
                <input type="text" placeholder="Search notifications..." style={{
                    width: 'calc(100% - 20px)',
                    padding: 10,
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
                            marginBottom: '5px'
                        }}></div>
                        {user}
                    </div>
                ))}
            </div>
            <h2>Messages</h2>

            <div style={{marginTop: '20px'}}>
                {messages.map(msg =>
                    <ChattingStatus key={msg.name} name={msg.name} parentId={msg.parentId} text={msg.text}
                                    time={msg.time}/>)}
            </div>

        </div>
    );
};