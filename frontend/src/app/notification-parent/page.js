// // // pages/index.js
// // 'use client'
// // import React, {useState} from 'react';
// // import StatusCard from '../../components/StatusCard';
// // import Header from "../../components/Header";
// //
// // export default function Home() {
// //
// //
// //     return (
// //         <div className="flex flex-col h-screen bg-gray-100 p-4">
// //             <Header title="Emma-parent" navigateTo={"/notification-homepage"}/>
// //             <StatusCard
// //                 parentId="P123456"
// //                 walkerId="2"
// //                 status="Accepted"
// //                 time="2024-09-12T14:45:00"
// //             />
// //         </div>
// //     );
// // }
// // pages/index.js
// 'use client'
// import React, {useState} from 'react';
// import StatusCard from '../../components/StatusCard';
// import Header from "../../components/Header";
// import {replace} from "react-router-dom";
//
// export default function Home() {
//
//     const [statusCards, setStatusCards] = useState([]);
//
//     const myInit = {
//         method: 'GET',
//         headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
//         mode: 'cors',
//         cache: 'default'
//     };
//     const walkerRequestId = 1;
//     const requestURL = new Request(`http://127.0.0.1:8080/Notification/findNotificationByWalkerRequestId/${walkerRequestId}`, myInit);
//
//     fetch(requestURL)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             // console.info(response.json())
//             return response.json();
//         })
//         .then(data => {
//                 setStatusCards(data);
//             })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
//
//     // 处理新通知，将其添加到 statusCards 列表
//     const handleNewNotification = (notification) => {
//         const { parentId, walkerId, statusPrevious, statusChanged, time } = notification;
//         const newCard = { parentId, walkerId, statusPrevious, statusChanged, time };
//         setStatusCards(prevCards => [...prevCards, newCard]);
//     };
//
//     return (
//         <div className="flex flex-col h-screen bg-gray-100 p-4">
//             <Header title="Emma-parent" navigateTo={"/notification-homepage"}/>
//
//             {/* 使用 NotificationWebSocket 组件来接收 WebSocket 消息 */}
//             {/*<NotificationWebSocket onNewNotification={handleNewNotification} />*/}
//
//             {statusCards && statusCards.length > 0 && statusCards.map((card, index) => (
//                 <StatusCard
//                     key={index}
//                     parentId={card.parentId}
//                     walkerId={card.walkerId}
//                     status={card.status}
//                     time={card.time}
//                 />
//             ))}
//         </div>
//     );
// }
'use client'
import React, {useState, useEffect} from 'react';
import StatusCard from '../../components/StatusCard';
import Header from "../../components/Header";
import { format } from 'date-fns';

export default function Home() {
    const [requestIds, setrequestIds] = useState([]); // 初始化为空数组
    const [Notifications,setNotifications] = useState([]);
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('roles');

    // if (!role.includes("parent")) {
    //     console.error('Not a parent, no fetch executed');
    //     return; // 如果不是 walker 角色，直接返回
    // }
    const parentId = parseInt(userId, 10); // 直接将 userId 设置为 parentId

    // console.info("parentId ID set to: " + parentId);
    // console.info("parentId role set to: " + role);

    //根据parentId获取他所有的requestId
    useEffect(() => {

        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            mode: 'cors',
            cache: 'default'
        };
        //修改到这了
        const requestURL = `http://127.0.0.1:8080/requests/getRequestsByParentId/${parentId}`;
        fetch(requestURL, myInit)
            .then(response => {
                if (!response.ok) {throw new Error('Network response was not ok0');}
                return response.json();})
            .then(data => {
                // console.info(data);
                // console.info(data.map(item => item.requestId));
                setrequestIds(data.map(item => item.requestId));
            })// 设置整个返回数据为状态卡片
            .catch(error => {
                console.error('Error fetching data:', error);});
        },[parentId]);

    useEffect(() => {
        console.log("Current requestIds:", requestIds); // 每次 Notifications 更新时输出当前值
    }, [requestIds]); // 监控 Notifications 变化

// =======检查到这里了
    function fetchData(requestId) {
        return fetch(`http://127.0.0.1:8080/Notification/findNotificationByRequestId/${requestId}`, {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            mode: 'cors',
            cache: 'default'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data for requestId ${requestId}`);
                }
                return response.json();
            }).then(data => {
                // console.log(`Data received for requestId ${requestId}:`, data);
                return data;
            })
            .catch(error => {
                console.error(`Error fetching data for requestId ${requestId}:`, error);
            });
    }

    function fetchAllData(requestIds) {
        // console.log("Request IDs to fetch data for:", requestIds);
        const promises = requestIds.map(fetchData); // 创建一个promise数组
        Promise.all(promises)
            .then(results => {
                setNotifications(results.flat());
                // console.info("Notifications updated:", results.flat()); // 检查 Notifications 是否正确更新
            })
            .catch(error => {
                console.error('Error fetching all data:', error);
            });
    }

    useEffect(() => {
        if (requestIds.length > 0) { // 确保 requestIds 不是空数组
            fetchAllData(requestIds);
        }
    }, [requestIds]); // 当 requestIds 更新时，再次调用 fetchAllData

    // useEffect(() => {
    //     console.log("Current Notifications:", Notifications); // 每次 Notifications 更新时输出当前值
    // }, [Notifications]); // 监控 Notifications 变化


    //获取notification对应walker的surname
    function fetchWalkerByNotification(notificationId) {
        return fetch(`http://127.0.0.1:8080/Notification/findWalkerByNotification/${notificationId}`, {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            mode: 'cors',
            cache: 'default'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch walker data for notificationId ${notificationId}`);
                }
                return response.json();
            })
            .then(data => data.surname)  // Assuming the API returns an object with a surname field
            .catch(error => {
                console.error('Error fetching walker data:', error);
            },[notificationId]);
    }

    // function fetchAllWalkers() {
    //     console.log("Fetching all data for current Notifications:", Notifications);
    //     const promises = Notifications.map(notification =>
    //         fetchData(notification).
    //         then(notification =>
    //             fetchWalkerByNotification(notification.notificationId).
    //             then(surname => ({
    //                 ...notification,
    //                 walkerSurname: surname
    //             }))
    //         )
    //     );
    //     Promise.all(promises)
    //         .then(results => {
    //             console.log("All notifications with walker data:", results);
    //             setNotifications(results);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching all data:', error);
    //         });
    // }
    function fetchAllWalkers() {
        console.log("Fetching all data for current Notifications:", Notifications); // 输出当前 Notifications
        const promises = Notifications.map(notification => {
            // console.log(`Fetching walker data for notificationId: ${notification.notificationId}`); // 输出当前处理的 notificationId
            return fetchWalkerByNotification(notification.notificationId)
                .then(surname => {
                    // console.log(`Walker surname for notificationId ${notification.notificationId}:`, surname); // 输出获取到的 walker 姓氏
                    return {
                        ...notification,
                        walkerSurname: surname
                    };
                });
        });

        // 等待所有异步操作完成
        Promise.all(promises)
            .then(results => {
                console.log("All notifications with walker data:", results); // 输出合并后的通知数据
                setNotifications(results); // 更新状态
            })
            .catch(error => {
                console.error('Error fetching all data:', error); // 错误处理
            });
    }

    useEffect(() => {
        fetchAllWalkers();
    },[Notifications.length]); // 依赖于Notifications数组的变化

    useEffect(() => {
        console.log("Current Notifications:", Notifications);
    }, [Notifications]);  // 每次Notifications更新时输出当前状态

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4" style={{ overflowY: 'auto' }}>
            <Header title="Notification-parent" navigateTo={"/message"}/>
            {/* 保护性检查，只有当statusCards是非空数组时，才渲染 */}

            {Notifications && Notifications.length > 0 && Notifications.map((notification, index) => (
                <StatusCard
                    key={index}
                    title = {"Application Status Change"}
                    statusChanged={`${notification.walkerSurname} has applied your application!`}
                    time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
                    // onDelete={() => handleDelete(index)}  // 将删除函数传递给 StatusCard
                />
            ))}
        </div>
    );

    // 测试页面
    // {Notifications && Notifications.length > 0 && Notifications.map((notification, index) => {
    //     // 直接在 map 回调中执行 console.log
    //     console.log(notification);
    //     return (
    //         <StatusCard
    //             // key={index}
    //             // parentId={parentId}
    //             // walkerId={walkerId}
    //             statusPrevious={notification.walkerSurname}
    //             // statusChanged={card.statusChanged}
    //             // time={card.time}
    //         />
    //     );
    // })}
}

