'use client'

import Head from 'next/head'
import {useEffect, useState} from "react";

export default function Home() {
    const [tempSearch, setTempSearch] = useState(''); // 用来临时存储搜索栏输入的值
    const [searchTerm, setSearchTerm] = useState(''); // 用来存储确认后的搜索值
    const [user, setUser] = useState(null);  // 用于存储从后端返回的用户信息
    const [chatBars, setChatBars] = useState(null);  // 用于存储从后端返回的用户信息
    const [userId,setUserId] = useState('');

    //获取并设置主用户的userId
    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId"); // 从sessionStorage获取userId
        const userIdLong = parseInt(storedUserId, 10); // 将userId字符串转换为长整型
        if (!isNaN(userIdLong)) { // 检查转换结果是否为有效数字
            setUserId(userIdLong); // 如果是有效数字，则设置到状态变量中
        }
    }, []); // 空依赖数组，确保只在组件加载时执行一次

    //输入parentid后，添加和此parent的对话框，获取parent相关信息
    useEffect(() => {
        if (searchTerm) {
            saveChatBar();
            fetchParentByUserId();
        }
    }, [searchTerm]);  // 确保 searchTerm 改变时，触发数据更新

    //当点击submit的时候，创建和对应用户的聊天框
    function saveChatBar() {
        const userIdLong = parseInt(userId, 10);
        const searchTermLong = parseInt(searchTerm, 10);
        fetch(`http://localhost:8080/ChatBar/addChatBar?userIdFrom=${userIdLong}&userIdTo=${searchTermLong}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token') },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }else {
                    console.info('Successfully create the chatBar.')
                }})
            .catch(error => console.error('Error:', error));
    }
    //通过userId获取对应的parent身份的角色信息，更新至user
    function fetchParentByUserId() {
        return fetch(`http://localhost:8080/roles/getParentByUserId/${searchTerm}`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ` + sessionStorage.getItem('token') },
            mode: 'cors',
            cache: 'default'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch parent data by walkerId: ${searchTerm}`);
                }
                // console.info(response.json())
                // console.info("upupup")
                return response.json();
            })
            .then(data =>{
                console.log('Fetched data user name is:', data.user.name);  // 打印数据到控制台
                setUser(data.user.name);  // 假设你想将数据存储在状态中
                return data.user.name;  // 可以继续传递数据以供后续使用
            })  // Assuming the API returns an object with a name field
            .catch(error => {
                console.error('Error fetching parent data:', error);
            });
    }


    //加载、初始化页面中的用户聊天框，聊天框中的信息包括：1.聊天框id 2.userFrom 3.userTo 4.state 5.聊天对象的name
    useEffect(() => {
        getChatBars();
    }, [searchTerm]);  // 确保 searchTerm 改变时，触发数据更新

    //获取chatBars，并向其中加入聊天对象的用户名，更新至chatBars
    function getChatBars() {
        fetch(`http://localhost:8080/ChatBar/getChatBars/${userId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token') },
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }else {
                console.info('Successfully get the chatBars.')
            }
            // console.log(response.json());
            // console.log("sdad")
            return response.json();
        }).then(data => Promise.all(data.map(bar => {
            console.log('Bar object:', bar);
            return fetch(`http://localhost:8080/roles/getParentByUserId/${bar.userTo.id}`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ` + sessionStorage.getItem('token')},
            }).then(res => res.json())
                .then(user => ({...bar, name: user.name}))
        })))
            .then(chatBarsWithUsernames => {
                setChatBars(chatBarsWithUsernames);
                // console.info(chatBarsWithUsernames)
                // console.info("upupup")
            }).catch(error => console.error('Error:', error));
    }

    useEffect(() => {
        console.log('Chat bars updated:', chatBars);
    }, [chatBars]);

    //每次点击提交，触发搜索用户等一系列钩子方法
    function handleSearch() {
        setSearchTerm(tempSearch); // 更新 searchTerm 触发搜索
    }

    // 在页面点击x后，更新聊天栏状态为关闭的函数
    function closeChatBar(userIdTo) {
        fetch(`http://localhost:8080/ChatBar/updateChatBar?userIdFrom=${userId}&userIdTo=${userIdTo}&state=close`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
            body: JSON.stringify({ state: 'close' }) // 确认API需要的具体格式
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update chat bar status');
                }
                return response.json();
            })
            .then(() => {
                setChatBars(prevChatBars => prevChatBars.filter(bar => bar.id !== chatBarId));
                window.location.reload();
            })
            .catch(error => console.error('Error:', error));
    }

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
            <div style={{margin: '10px 20px'}}>
                <input type="text" placeholder="Search notifications..." style={{
                    width: 'calc(100% - 20px)',
                    padding: 10,
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                }}
                       value={tempSearch}
                       onChange={e => setTempSearch(e.target.value)}
                />
                <button onClick={handleSearch} style={{
                    padding: '10px 20px',
                    marginLeft: '10px',
                    background: '#0070f3',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: 'none'
                }}>Confirm
                </button>
            </div>
            <h2>Recently Chat</h2>

            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {chatBars && chatBars.map((bar, index) => (
                    bar.status !== 'close' && (
                        <div key={index} style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px',
                            margin: '10px',
                            minWidth: '200px',
                            position: 'relative'
                        }}>
                            <h3>Chat with user {bar.name}</h3>
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                }}
                                onClick={() => closeChatBar(bar.userTo.id)}
                            >
                                X
                            </button>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};