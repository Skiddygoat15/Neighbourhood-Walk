// 'use client'
//
// import Head from 'next/head'
// <<<<<<< Updated upstream
// import {useEffect, useState} from "react";
// =======
// <<<<<<< Updated upstream
// import ChattingStatus from "@/components/ChattingStatus";
// import {useRouter} from "next/navigation";
// import {useEffect} from "react";
// >>>>>>> Stashed changes
//
// export default function Home() {
//     const [tempSearch, setTempSearch] = useState(''); // 用来临时存储搜索栏输入的值
//     const [searchTerm, setSearchTerm] = useState(''); // 用来存储确认后的搜索值
//     const [user, setUser] = useState(null);  // 用于存储从后端返回的用户信息
//     const [chatBars, setChatBars] = useState(null);  // 用于存储从后端返回的用户信息
//     const [userId,setUserId] = useState('');
//
//     //获取并设置主用户的userId
//     useEffect(() => {
//         const storedUserId = sessionStorage.getItem("userId"); // 从sessionStorage获取userId
//         const userIdLong = parseInt(storedUserId, 10); // 将userId字符串转换为长整型
//         if (!isNaN(userIdLong)) { // 检查转换结果是否为有效数字
//             setUserId(userIdLong); // 如果是有效数字，则设置到状态变量中
//         }
//     }, []); // 空依赖数组，确保只在组件加载时执行一次
//
//     //输入parentid后，添加和此parent的对话框，获取parent相关信息
//     useEffect(() => {
//         if (searchTerm) {
//             saveChatBar();
//             fetchParentByUserId();
//         }
//     }, [searchTerm]);  // 确保 searchTerm 改变时，触发数据更新
//
// <<<<<<< Updated upstream
//     //当点击submit的时候，创建和对应用户的聊天框
// =======
//     const router = useRouter();  // 使用 useRouter
// =======
// import {useEffect, useState} from "react";
// import {useRouter} from "next/navigation";
//
// export default function Home() {
//     const [tempSearch, setTempSearch] = useState(''); // 用来临时存储搜索栏输入的值
//     const [searchTerm, setSearchTerm] = useState(''); // 用来存储确认后的搜索值
//     // const [user, setUser] = useState(null);  // 用于存储从后端返回的用户信息
//     const [chatBars, setChatBars] = useState(null);  //用于储存该用户名下所有的chatBars
//     const [userId,setUserId] = useState('');
//     const [allRoles, setAllRoles] = useState([])
//     const [confirmClick, setConfirmClick] = useState(0);
//
//     function getAllRoles() {
//         fetch(`http://localhost:8080/roles`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ` + localStorage.getItem('token')
//             }
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to get all roles');
//                 }
//                 console.info("Successfully get all roles.")
//                 return response.json();
//             })
//             .then(data => {
//                 // console.info("all roles are: ",data);
//                 setAllRoles(data);
//             })
//             .catch(error => console.error('Error:', error));
//     }
//
//     //1.初始化，获取并设置主用户的userId
//     useEffect(() => {
//         const storedUserId = localStorage.getItem("userId"); // 从localStorage获取userId
//         const userIdLong = parseInt(storedUserId, 10); // 将userId字符串转换为长整型
//         if (!isNaN(userIdLong)) { // 检查转换结果是否为有效数字
//             setUserId(userIdLong); // 如果是有效数字，则设置到状态变量中
//         }
//         getAllRoles();
//     }, []); // 空依赖数组，确保只在组件加载时执行一次
//
//     //2.点击Confim后触发，检查当输入userId存在且角色为parent的时候才会修改searchTerm，从这以后保证每个searchTerm都是正确的parentId
//     function handleSearch() {
//         const parentRole = allRoles.find(role => role.userId.toString() === tempSearch && role.roleType === 'parent');
//         if (parentRole) {
//             console.info("Found a match for a parent role with userId:", parentRole);
//             setSearchTerm(tempSearch);  // 如果找到匹配，设置searchTerm
//         } else {
//             console.info("No match found for the given tempSearch as a parent userId. Input another userId please.");
//             setSearchTerm('');
//         }
//         setConfirmClick(prev => prev + 1); // 更新点击计数
//     }
//
//     //初始化
//     useEffect(() => {
//         if (searchTerm) {
//             getOrAddChatBar();
//         }
//     }, [searchTerm]);  // 确保 searchTerm 改变时，触发数据更新
//
//     useEffect(() => {
//         getChatBar();
//         if (searchTerm) {
//             const searchTermLong = parseInt(searchTerm, 10);
//             openChatBar(searchTermLong);
//             console.info("searchTerm is ",searchTerm)
//         }
//     }, [searchTerm, confirmClick]);
//
//     //chatBars更新提示
//     useEffect(() => {
//         console.log('Chat bars updated:', chatBars);
//     }, [chatBars]);
//
//     function getOrAddChatBar() {
//         fetch(`http://localhost:8080/ChatBar/getChatBars/${userId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ` + localStorage.getItem('token')
//             },
//         })
//             .then(response => response.json())
//             .then(data => {
//                 const filteredData = data.filter(bar => bar.userTo.id === parseInt(searchTerm, 10));
//                 console.info("searchTerm is :",filteredData)
//                 if (data && data.length > 0 && filteredData.length >0){
//                     setChatBars(data);
//                     console.info("Successfully get chatBars.", data);
//                 }
//                 else {
//                     if (searchTerm !== ''){
//                         console.info('ChatBar does not exist, creating a new one.');
//                         saveChatBar();
//                         getOrAddChatBar();
//                     }else {
//                         console.info('Need a right searchTerm.');
//                     }
//                 }
//             })
//             .catch(error => console.error('Error updating chat bars with names:', error));
//     }
//
// >>>>>>> Stashed changes
//     function saveChatBar() {
//         const userIdLong = parseInt(userId, 10);
//         const searchTermLong = parseInt(searchTerm, 10);
//         fetch(`http://localhost:8080/ChatBar/addChatBar?userIdFrom=${userIdLong}&userIdTo=${searchTermLong}`, {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json',
// <<<<<<< Updated upstream
//                 'Authorization': `Bearer ` + sessionStorage.getItem('token') },
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }else {
//                     console.info('Successfully create the chatBar.')
//                 }})
//             .catch(error => console.error('Error:', error));
//     }
//     //通过userId获取对应的parent身份的角色信息，更新至user
//     function fetchParentByUserId() {
//         return fetch(`http://localhost:8080/roles/getParentByUserId/${searchTerm}`, {
//             method: 'GET',
//             headers: {'Authorization': `Bearer ` + sessionStorage.getItem('token') },
//             mode: 'cors',
//             cache: 'default'
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Failed to fetch parent data by walkerId: ${searchTerm}`);
//                 }
//                 // console.info(response.json())
//                 // console.info("upupup")
//                 return response.json();
//             })
//             .then(data =>{
//                 console.log('Fetched data user name is:', data.user.name);  // 打印数据到控制台
//                 setUser(data.user.name);  // 假设你想将数据存储在状态中
//                 return data.user.name;  // 可以继续传递数据以供后续使用
//             })  // Assuming the API returns an object with a name field
//             .catch(error => {
//                 console.error('Error fetching parent data:', error);
//             });
//     }
//
//
//     //加载、初始化页面中的用户聊天框，聊天框中的信息包括：1.聊天框id 2.userFrom 3.userTo 4.state 5.聊天对象的name
//     useEffect(() => {
//         getChatBars();
//     }, [searchTerm]);  // 确保 searchTerm 改变时，触发数据更新
//
//     //获取chatBars，并向其中加入聊天对象的用户名，更新至chatBars
//     function getChatBars() {
//         fetch(`http://localhost:8080/ChatBar/getChatBars/${userId}`, {
//             method: 'GET',
//             headers: {'Content-Type': 'application/json',
//                 'Authorization': `Bearer ` + sessionStorage.getItem('token') },
//         }).then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }else {
//                 console.info('Successfully get the chatBars.')
//             }
//             // console.log(response.json());
//             // console.log("sdad")
//             return response.json();
//         }).then(data => Promise.all(data.map(bar => {
//             console.log('Bar object:', bar);
//             return fetch(`http://localhost:8080/roles/getParentByUserId/${bar.userTo.id}`, {
//                 method: 'GET',
//                 headers: {'Authorization': `Bearer ` + sessionStorage.getItem('token')},
//             }).then(res => res.json())
//                 .then(user => ({...bar, name: user.name}))
//         })))
//             .then(chatBarsWithUsernames => {
//                 setChatBars(chatBarsWithUsernames);
//                 // console.info(chatBarsWithUsernames)
//                 // console.info("upupup")
//             }).catch(error => console.error('Error:', error));
//     }
//
//     useEffect(() => {
//         console.log('Chat bars updated:', chatBars);
//     }, [chatBars]);
//
//     //每次点击提交，触发搜索用户等一系列钩子方法
//     function handleSearch() {
//         setSearchTerm(tempSearch); // 更新 searchTerm 触发搜索
//     }
//
//     // 在页面点击x后，更新聊天栏状态为关闭的函数
// =======
//                 'Authorization': `Bearer ` + localStorage.getItem('token') },
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     console.info("Failed to create the chatBar, maybe you put in a wrong userId or a parent's userId.")
//                 }else {
//                     console.info("Successfully create the chatBar")
//                 }})
//             .catch(error => console.error('Error:', error));
//     }
//
//     function getChatBar() {
//         // 先检查是否已经存在该聊天框
//         fetch(`http://localhost:8080/ChatBar/getChatBars/${userId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ` + localStorage.getItem('token')
//             },
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch chat bars: ' + response.statusText);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                     if (data && data.length > 0){
//                         setChatBars(data)
//                         console.info("Successfully get ChatBar: ", data)
//                     }else {
//                         console.info("Failed to get ChatBar.")
//                     }
//                 }
//             )
//             .catch(error => console.error('Error updating chat bars with names:', error));
//     }
//
// >>>>>>> Stashed changes
//     function closeChatBar(userIdTo) {
//         fetch(`http://localhost:8080/ChatBar/updateChatBar?userIdFrom=${userId}&userIdTo=${userIdTo}&state=close`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
// <<<<<<< Updated upstream
//                 'Authorization': `Bearer ` + sessionStorage.getItem('token')
// =======
//                 'Authorization': `Bearer ` + localStorage.getItem('token')
// >>>>>>> Stashed changes
//             },
//             body: JSON.stringify({ state: 'close' }) // 确认API需要的具体格式
//         })
//             .then(response => {
//                 if (!response.ok) {
// <<<<<<< Updated upstream
//                     throw new Error('Failed to update chat bar status');
//                 }
//                 return response.json();
//             })
//             .then(() => {
//                 setChatBars(prevChatBars => prevChatBars.filter(bar => bar.id !== chatBarId));
//                 window.location.reload();
//             })
//             .catch(error => console.error('Error:', error));
//     }
// =======
//                     throw new Error('Failed to update chat bar state');
//                 }
//                 console.info("Successfully closed the chatBar.")
//                 getChatBar();
//             })
//             .catch(error => console.error('Error:', error));
//     }
// >>>>>>> Stashed changes
//
//     function openChatBar(userIdTo) {
//         fetch(`http://localhost:8080/ChatBar/updateChatBar?userIdFrom=${userId}&userIdTo=${userIdTo}&state=open`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ` + localStorage.getItem('token')
//             },
//             body: JSON.stringify({ state: 'open' }) // 确认API需要的具体格式
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to open the chat bar.');
//                 }
//                 console.info('Successfully open the chatBar.')
//                 getChatBar();
//             })
//             .catch(error => console.error('Error:', error));
//     }
//
//     //未添加跳转的页面
//     // return (
//     //     <div style={{padding: 20, backgroundColor: '#fff', minHeight: '100vh'}}>
//     //         <Head>
//     //             <title>Notifications</title>
//     //             <meta name="description" content="Notification page"/>
//     //             <link rel="icon" href="/favicon.ico"/>
//     //         </Head>
//     //
//     //         <div style={{
//     //             textAlign: 'center',
//     //             padding: '10px 0',
//     //             fontSize: '12px',
//     //             color: '#666',
//     //             position: 'sticky',
//     //             top: 0,
//     //             zIndex: 1000
//     //         }}>9:41
//     //         </div>
//     //         <h1 style={{color: '#333', fontSize: '24px', margin: '20px 0'}}>Messages</h1>
//     //
//     //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
//     //             <input type="text" placeholder="Search notifications..."
//     //                    style={{
//     //                        width: '70%',
//     //                        padding: 10,
//     //                        border: '1px solid #ccc',
//     //                        borderRadius: '8px',
//     //                        boxSizing: 'border-box'
//     //                    }}
//     //                    value={tempSearch}
//     //                    onChange={e => setTempSearch(e.target.value)}/>
//     //
//     //             <button onClick={() => handleSearch()} style={{
//     //                 padding: '10px 20px',
//     //                 marginLeft: '10px',
//     //                 background: '#0070f3',
//     //                 color: 'white',
//     //                 borderRadius: '8px',
//     //                 cursor: 'pointer',
//     //                 border: 'none'
//     //             }}>Confirm</button>
//     //
//     //         </div>
//     //         <h2 style={{
//     //             color: '#333',
//     //             fontSize: '15px',  // 增加字体大小
//     //             textAlign: 'center',  // 居中标题
//     //             margin: '20px 0'  // 增加上下外边距以提供空间
//     //         }}>Recently Chat</h2>
//     //
//     //         <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column'}}>
//     //             {chatBars && Array.isArray(chatBars) && chatBars
//     //                 .filter(bar => bar.state !== "close")
//     //                 .map((bar, index) => (
//     //                     <div key={index} style={{
//     //                         border: '1px solid #ccc',
//     //                         borderRadius: '8px',
//     //                         padding: '20px',
//     //                         margin: '10px auto',  // 使chatBar在水平方向上居中
//     //                         minWidth: '300px',
//     //                         width: '100%',  // 聊天栏宽度占满可用空间
//     //                         maxWidth: '600px',  // 设置一个最大宽度以保持设计的整洁
//     //                         backgroundColor: '#f9f9f9',
//     //                         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//     //                         position: 'relative',
//     //                         display: 'flex',  // 使用flex布局使内容居中
//     //                         flexDirection: 'row',  // 内容沿水平方向排列
//     //                         alignItems: 'center',  // 垂直居中对齐
//     //                         justifyContent: 'center'  // 水平居中对齐
//     //                     }}>
//     //                         <h3 style={{
//     //                             fontSize: '16px',  // 调整字体大小以更好地适应移动和桌面视图
//     //                             margin: 0,  // 移除外边距以防止布局偏移
//     //                             padding: '0 10px'  // 增加内边距确保文本不紧贴边缘
//     //                         }}>Chat with user {bar.userTo.name}</h3>
//     //                         <button style={{
//     //                             position: 'absolute',
//     //                             top: '10px',
//     //                             right: '10px',
//     //                             color: 'black',
//     //                             border: 'none',
//     //                             borderRadius: '50%',
//     //                             cursor: 'pointer',
//     //                             width: '30px',
//     //                             height: '30px',
//     //                             display: 'flex',
//     //                             alignItems: 'center',
//     //                             justifyContent: 'center'
//     //                         }}  onClick={() => {
//     //                             closeChatBar(bar.userTo.id);
//     //                             getOrAddChatBar();
//     //                         }}>
//     //                             X
//     //                         </button>
//     //                     </div>
//     //                 ))}
//     //         </div>
//     //     </div>
//     // );
// >>>>>>> Stashed changes
//
//     return (
//         <div style={{padding: 20, backgroundColor: '#fff', minHeight: '100vh'}}>
//             <Head>
//                 <title>Notifications</title>
//                 <meta name="description" content="Notification page"/>
//                 <link rel="icon" href="/favicon.ico"/>
//             </Head>
//
//             <div style={{
//                 textAlign: 'center',
//                 padding: '10px 0',
//                 fontSize: '12px',
//                 color: '#666',
//                 position: 'sticky',
//                 top: 0,
//                 zIndex: 1000
//             }}>9:41
//             </div>
//             <h1 style={{color: '#333', fontSize: '24px', margin: '20px 0'}}>Messages</h1>
// <<<<<<< Updated upstream
// =======
// <<<<<<< Updated upstream
//             {/*<button onClick={goToNotificationPage} style={{*/}
//             {/*    padding: '8px 16px',*/}
//             {/*    background: '#0070f3',*/}
//             {/*    color: 'white',*/}
//             {/*    borderRadius: '8px',*/}
//             {/*    cursor: 'pointer',*/}
//             {/*    border: 'none',*/}
//             {/*    fontSize: '14px'*/}
//             {/*}}>*/}
//             {/*    Go to My Notification*/}
//             {/*</button>*/}
// >>>>>>> Stashed changes
//             <div style={{margin: '10px 20px'}}>
//                 <input type="text" placeholder="Search notifications..." style={{
//                     width: 'calc(100% - 20px)',
//                     padding: 10,
//                     border: '1px solid #ccc',
//                     borderRadius: '8px',
//                     boxSizing: 'border-box'
//                 }}
//                        value={tempSearch}
//                        onChange={e => setTempSearch(e.target.value)}
//                 />
//                 <button onClick={handleSearch} style={{
//                     padding: '10px 20px',
//                     marginLeft: '10px',
//                     background: '#0070f3',
//                     color: 'white',
//                     borderRadius: '8px',
//                     cursor: 'pointer',
//                     border: 'none'
//                 }}>Confirm
//                 </button>
//             </div>
//             <h2>Recently Chat</h2>
//
//             <div style={{display: 'flex', flexWrap: 'wrap'}}>
//                 {chatBars && chatBars.map((bar, index) => (
//                     bar.status !== 'close' && (
//                         <div key={index} style={{
//                             border: '1px solid #ccc',
//                             borderRadius: '8px',
//                             padding: '10px',
//                             margin: '10px',
//                             minWidth: '200px',
//                             position: 'relative'
//                         }}>
//                             <h3>Chat with user {bar.name}</h3>
//                             <button
//                                 style={{
//                                     position: 'absolute',
//                                     top: '10px',
//                                     right: '10px',
//                                     color: 'black',
//                                     border: 'none',
//                                     borderRadius: '50%',
//                                     cursor: 'pointer'
//                                 }}
//                                 onClick={() => closeChatBar(bar.userTo.id)}
//                             >
//                                 X
//                             </button>
//                         </div>
//                     )
//                 ))}
// =======
//
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
//                 <input type="text" placeholder="Search notifications..."
//                        style={{
//                            width: '70%',
//                            padding: 10,
//                            border: '1px solid #ccc',
//                            borderRadius: '8px',
//                            boxSizing: 'border-box'
//                        }}
//                        value={tempSearch}
//                        onChange={e => setTempSearch(e.target.value)}/>
//
//                 <button onClick={() => handleSearch()} style={{
//                     padding: '10px 20px',
//                     marginLeft: '10px',
//                     background: '#0070f3',
//                     color: 'white',
//                     borderRadius: '8px',
//                     cursor: 'pointer',
//                     border: 'none'
//                 }}>Confirm</button>
//
//             </div>
//             <h2 style={{
//                 color: '#333',
//                 fontSize: '15px',  // 增加字体大小
//                 textAlign: 'center',  // 居中标题
//                 margin: '20px 0'  // 增加上下外边距以提供空间
//             }}>Recently Chat</h2>
//
//             <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column'}}>
//                 {chatBars && Array.isArray(chatBars) && chatBars
//                     .filter(bar => bar.state !== "close")
//                     .map((bar, index) => {
//                         const router = useRouter();
//                         const handleChatClick = () => {
//                             // 跳转到对话页面，假设路由是 /message-chat-walker/:userId
//                             // router.push(`/message-chat-walker-final/${searchTerm}`);};
//                             router.push(`/message-chat-walker-final/${searchTerm}`);};
//                         return (
//                             <div key={index} style={{
//                                 border: '1px solid #ccc',
//                                 borderRadius: '8px',
//                                 padding: '20px',
//                                 margin: '10px auto',  // 使chatBar在水平方向上居中
//                                 minWidth: '300px',
//                                 width: '100%',  // 聊天栏宽度占满可用空间
//                                 maxWidth: '600px',  // 设置一个最大宽度以保持设计的整洁
//                                 backgroundColor: '#f9f9f9',
//                                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                                 position: 'relative',
//                                 display: 'flex',  // 使用flex布局使内容居中
//                                 flexDirection: 'row',  // 内容沿水平方向排列
//                                 alignItems: 'center',  // 垂直居中对齐
//                                 justifyContent: 'center'}}>
//
//                                 <h3 onClick={handleChatClick} style={{
//                                     fontSize: '16px',  // 调整字体大小以更好地适应移动和桌面视图
//                                     margin: 0,  // 移除外边距以防止布局偏移
//                                     padding: '0 10px',  // 增加内边距确保文本不紧贴边缘
//                                     cursor: 'pointer'  // 将鼠标样式设置为指针
//                                 }}>Chat with user {bar.userTo.name}</h3>
//
//                                 <button style={{
//                                     position: 'absolute',
//                                     top: '10px',
//                                     right: '10px',
//                                     color: 'black',
//                                     border: 'none',
//                                     borderRadius: '50%',
//                                     cursor: 'pointer',
//                                     width: '30px',
//                                     height: '30px',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center'
//                                 }} onClick={() => {
//                                     closeChatBar(bar.userTo.id);
//                                     getOrAddChatBar();
//                                 }}>X</button>
//                             </div>
//                         );
//                     })
//                 }
// >>>>>>> Stashed changes
//             </div>
//         </div>
//     );
// };
