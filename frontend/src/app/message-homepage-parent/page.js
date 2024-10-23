'use client'

import Head from 'next/head'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
    const [tempSearch, setTempSearch] = useState(''); // 用来临时存储搜索栏输入的值
    const [searchTerm, setSearchTerm] = useState(''); // 用来存储确认后的搜索值
    // const [user, setUser] = useState(null);  // 用于存储从后端返回的用户信息
    const [chatBars, setChatBars] = useState(null);  //用于储存该用户名下所有的chatBars
    const [userId,setUserId] = useState('');
    const [allRoles, setAllRoles] = useState([])
    const [confirmClick, setConfirmClick] = useState(0);

    function getAllRoles() {
        fetch(`http://localhost:8080/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to get all roles');
                }
                console.info("Successfully get all roles.")
                return response.json();
            })
            .then(data => {
                // console.info("all roles are: ",data);
                setAllRoles(data);
            })
            .catch(error => console.error('Error:', error));
    }

    //1.初始化，获取并设置主用户的userId
    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId"); // 从localStorage获取userId
        const userIdLong = parseInt(storedUserId, 10); // 将userId字符串转换为长整型
        if (!isNaN(userIdLong)) { // 检查转换结果是否为有效数字
            setUserId(userIdLong); // 如果是有效数字，则设置到状态变量中
        }
        getAllRoles();
    }, []); // 空依赖数组，确保只在组件加载时执行一次

    //2.点击Confim后触发，检查当输入userId存在且角色为walker的时候才会修改searchTerm，从这以后保证每个searchTerm都是正确的walkerId
    function handleSearch() {
        const walkerRole = allRoles.find(role => role.userId.toString() === tempSearch && role.roleType === 'walker');
        if (walkerRole) {
            console.info("Found a match for a walker role with userId:", walkerRole);
            setSearchTerm(tempSearch);  // 如果找到匹配，设置searchTerm
        } else {
            console.info("No match found for the given tempSearch as a walker userId. Input another userId please.");
            setSearchTerm('');
        }
        setConfirmClick(prev => prev + 1); // 更新点击计数
    }

    //初始化
    useEffect(() => {
        if (searchTerm) {
            getOrAddChatBar();
        }
    }, [searchTerm]);  // 确保 searchTerm 改变时，触发数据更新

    useEffect(() => {
        getChatBar();
        if (searchTerm) {
            const searchTermLong = parseInt(searchTerm, 10);
            openChatBar(searchTermLong);
            console.info("searchTerm is ",searchTerm)
        }
    }, [searchTerm, confirmClick]);

    //chatBars更新提示
    useEffect(() => {
        console.log('Chat bars updated:', chatBars);
    }, [chatBars]);

    function getOrAddChatBar() {
        fetch(`http://localhost:8080/ChatBar/getChatBars/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
        })
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(bar => bar.userTo.id === parseInt(searchTerm, 10));
                console.info("searchTerm is :",filteredData)
                if (data && data.length > 0 && filteredData.length >0){
                    setChatBars(data);
                    console.info("Successfully get chatBars.", data);
                }
                else {
                    if (searchTerm !== ''){
                        console.info('ChatBar does not exist, creating a new one.');
                        saveChatBar();
                        getOrAddChatBar();
                    }else {
                        console.info('Need a right searchTerm.');
                    }
                }
            })
            .catch(error => console.error('Error updating chat bars with names:', error));
    }

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
                    console.info("Failed to create the chatBar, maybe you put in a wrong userId or a walker's userId.")
                }else {
                    console.info("Successfully create the chatBar")
                }})
            .catch(error => console.error('Error:', error));
    }

    function getChatBar() {
        // 先检查是否已经存在该聊天框
        fetch(`http://localhost:8080/ChatBar/getChatBars/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch chat bars: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                    if (data && data.length > 0){
                        setChatBars(data)
                        console.info("Successfully get ChatBar: ", data)
                    }else {
                        console.info("Failed to get ChatBar.")
                    }
                }
            )
            .catch(error => console.error('Error updating chat bars with names:', error));
    }

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
                    throw new Error('Failed to update chat bar state');
                }
                console.info("Successfully closed the chatBar.")
                getChatBar();
            })
            .catch(error => console.error('Error:', error));
    }

    function openChatBar(userIdTo) {
        fetch(`http://localhost:8080/ChatBar/updateChatBar?userIdFrom=${userId}&userIdTo=${userIdTo}&state=open`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
            body: JSON.stringify({ state: 'open' }) // 确认API需要的具体格式
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to open the chat bar.');
                }
                console.info('Successfully open the chatBar.')
                getChatBar();
            })
            .catch(error => console.error('Error:', error));
    }

    //未添加跳转的页面
    // return (
    //     <div style={{padding: 20, backgroundColor: '#fff', minHeight: '100vh'}}>
    //         <Head>
    //             <title>Notifications</title>
    //             <meta name="description" content="Notification page"/>
    //             <link rel="icon" href="/favicon.ico"/>
    //         </Head>
    //
    //         <div style={{
    //             textAlign: 'center',
    //             padding: '10px 0',
    //             fontSize: '12px',
    //             color: '#666',
    //             position: 'sticky',
    //             top: 0,
    //             zIndex: 1000
    //         }}>9:41
    //         </div>
    //         <h1 style={{color: '#333', fontSize: '24px', margin: '20px 0'}}>Messages</h1>
    //
    //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
    //             <input type="text" placeholder="Search notifications..."
    //                    style={{
    //                        width: '70%',
    //                        padding: 10,
    //                        border: '1px solid #ccc',
    //                        borderRadius: '8px',
    //                        boxSizing: 'border-box'
    //                    }}
    //                    value={tempSearch}
    //                    onChange={e => setTempSearch(e.target.value)}/>
    //
    //             <button onClick={() => handleSearch()} style={{
    //                 padding: '10px 20px',
    //                 marginLeft: '10px',
    //                 background: '#0070f3',
    //                 color: 'white',
    //                 borderRadius: '8px',
    //                 cursor: 'pointer',
    //                 border: 'none'
    //             }}>Confirm</button>
    //
    //         </div>
    //         <h2 style={{
    //             color: '#333',
    //             fontSize: '15px',  // 增加字体大小
    //             textAlign: 'center',  // 居中标题
    //             margin: '20px 0'  // 增加上下外边距以提供空间
    //         }}>Recently Chat</h2>
    //
    //         <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column'}}>
    //             {chatBars && Array.isArray(chatBars) && chatBars
    //                 .filter(bar => bar.state !== "close")
    //                 .map((bar, index) => (
    //                     <div key={index} style={{
    //                         border: '1px solid #ccc',
    //                         borderRadius: '8px',
    //                         padding: '20px',
    //                         margin: '10px auto',  // 使chatBar在水平方向上居中
    //                         minWidth: '300px',
    //                         width: '100%',  // 聊天栏宽度占满可用空间
    //                         maxWidth: '600px',  // 设置一个最大宽度以保持设计的整洁
    //                         backgroundColor: '#f9f9f9',
    //                         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    //                         position: 'relative',
    //                         display: 'flex',  // 使用flex布局使内容居中
    //                         flexDirection: 'row',  // 内容沿水平方向排列
    //                         alignItems: 'center',  // 垂直居中对齐
    //                         justifyContent: 'center'  // 水平居中对齐
    //                     }}>
    //                         <h3 style={{
    //                             fontSize: '16px',  // 调整字体大小以更好地适应移动和桌面视图
    //                             margin: 0,  // 移除外边距以防止布局偏移
    //                             padding: '0 10px'  // 增加内边距确保文本不紧贴边缘
    //                         }}>Chat with user {bar.userTo.name}</h3>
    //                         <button style={{
    //                             position: 'absolute',
    //                             top: '10px',
    //                             right: '10px',
    //                             color: 'black',
    //                             border: 'none',
    //                             borderRadius: '50%',
    //                             cursor: 'pointer',
    //                             width: '30px',
    //                             height: '30px',
    //                             display: 'flex',
    //                             alignItems: 'center',
    //                             justifyContent: 'center'
    //                         }}  onClick={() => {
    //                             closeChatBar(bar.userTo.id);
    //                             getOrAddChatBar();
    //                         }}>
    //                             X
    //                         </button>
    //                     </div>
    //                 ))}
    //         </div>
    //     </div>
    // );

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

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
                <input type="text" placeholder="Search notifications..."
                       style={{
                           width: '70%',
                           padding: 10,
                           border: '1px solid #ccc',
                           borderRadius: '8px',
                           boxSizing: 'border-box'
                       }}
                       value={tempSearch}
                       onChange={e => setTempSearch(e.target.value)}/>

                <button onClick={() => handleSearch()} style={{
                    padding: '10px 20px',
                    marginLeft: '10px',
                    background: '#0070f3',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: 'none'
                }}>Confirm</button>

            </div>
            <h2 style={{
                color: '#333',
                fontSize: '15px',  // 增加字体大小
                textAlign: 'center',  // 居中标题
                margin: '20px 0'  // 增加上下外边距以提供空间
            }}>Recently Chat</h2>

            <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column'}}>
                {chatBars && Array.isArray(chatBars) && chatBars
                    .filter(bar => bar.state !== "close")
                    .map((bar, index) => {
                        const router = useRouter();
                        const handleChatClick = () => {
                            router.push(`/message-chat-parent-final/${searchTerm}`);};
                        return (
                            <div key={index} style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '20px',
                                margin: '10px auto',  // 使chatBar在水平方向上居中
                                minWidth: '300px',
                                width: '100%',  // 聊天栏宽度占满可用空间
                                maxWidth: '600px',  // 设置一个最大宽度以保持设计的整洁
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                position: 'relative',
                                display: 'flex',  // 使用flex布局使内容居中
                                flexDirection: 'row',  // 内容沿水平方向排列
                                alignItems: 'center',  // 垂直居中对齐
                                justifyContent: 'center'}}>

                                <h3 onClick={handleChatClick} style={{
                                    fontSize: '16px',  // 调整字体大小以更好地适应移动和桌面视图
                                    margin: 0,  // 移除外边距以防止布局偏移
                                    padding: '0 10px',  // 增加内边距确保文本不紧贴边缘
                                    cursor: 'pointer'  // 将鼠标样式设置为指针
                                }}>Chat with user {bar.userTo.name}</h3>

                                <button style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} onClick={() => {
                                    closeChatBar(bar.userTo.id);
                                    getOrAddChatBar();
                                }}>X</button>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};
