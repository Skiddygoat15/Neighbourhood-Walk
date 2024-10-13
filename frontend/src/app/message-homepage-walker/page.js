'use client'

import Head from 'next/head'
import ChattingStatus from "@/components/ChattingStatus";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState(''); // 用来存储搜索栏输入的值
    const [user, setUser] = useState(null);  // 用于存储从后端返回的用户信息
    const [error, setError] = useState(null);  // 用于存储错误信息

    const users = ['Emma', 'Ava', 'Sophia', 'Amelia'];
    const path = '../message-chat-walker'
    const messages = [
        { name: 'Abigail', text: 'Accept', time: '23 min', parentId: '1'},
        // { name: 'Elizabeth', text: 'Ok, see you then.', time: '27 min', parentId: '2'},
        // { name: 'Penelope', text: 'You: Hey! What\'s up, long time.', time: '33 min', parentId: '3'},
        // { name: 'Chloe', text: 'You: Hello how are you?', time: '50 min', parentId: '4'}
    ];

    const router = useRouter();  // 使用 useRouter

    // Fetch请求后端API获取用户信息,并将用户信息保存至user
    const fetchUserById = async () => {
        try {
            const response = await fetch(`http://localhost:8080/Users/getUserById/${searchTerm}`,{
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
                mode: 'cors',
                cache: 'default'
            });
            if (!response.ok) {
                throw new Error("User not found");
            }
            const userData = await response.json();
            setUser(userData);  // 设置用户数据
            setError(null);  // 清除错误
        } catch (err) {
            setError(err.message);  // 如果出错，设置错误信息
            setUser(null);  // 清除用户数据
        }
    };

    // useEffect(() => {
    //     const filtered = userList.filter(user =>
    //         user.userId.includes(searchTerm) || user.username.toLowerCase().includes(searchTerm.toLowerCase())
    //     );
    //     setFilteredUsers(filtered);
    // }, [searchTerm]); // 每次 searchTerm 变化时，重新计算 filteredUsers

    // ！！！！！！！！接下来要实现的是：后端创建chatbar（记录主用户的地方是否显示副用户），
    // 创建使用查找到的user信息生成chatbar，并显示在主用户的homepage中，并且为chatbar设置一个关闭

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
                    <ChattingStatus key={msg.name}
                                    name={msg.name}
                                    parentId={msg.parentId}
                                    text={msg.text}
                                    time={msg.time}
                                    path={path}
                    />)}
            </div>

        </div>
    );
};