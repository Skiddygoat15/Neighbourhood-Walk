'use client'
import React, {useState, useEffect} from 'react';
import StatusCard from '../../components/StatusCard';
import StatusCard_profile from '../../components/StatusCard_profile';
import Header from "../../components/Header";
import { format } from 'date-fns';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function Home() {
    //const [textColor, setTextColor] = useState('text-black');
    const [requestIds, setrequestIds] = useState([]); // 初始化为空数组
    const [Notifications,setNotifications] = useState([]);
    const [Notifications_Profile, setNotifications_Profile] = useState([]);

    const [refreshKey, setRefreshKey] = useState(0); // 用于触发重新渲染的状态
    // if (!role.includes("parent")) {
    //     console.error('Not a parent, no fetch executed');
    //     return; // 如果不是 walker 角色，直接返回
    // }
    let parentId = null;
    let userId = null;
    let role = null;
    let token = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
        parentId = sessionStorage.getItem('userId');
        userId = sessionStorage.getItem('userId');
        role = sessionStorage.getItem('currentRole');
        token = sessionStorage.getItem('token');
    }
    //const parentId = parseInt(userId, 10); // 直接将 userId 设置为 parentId
    const textColor = useTextColor();
    // console.info("parentId ID set to: " + parentId);
    // console.info("parentId role set to: " + role);

    //根据parentId获取他所有的requestId
    useEffect(() => {

        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        };
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
    },[parentId, refreshKey]);


        // useEffect(() => {
    //     console.log("Current requestIds:", requestIds); // 每次 Notifications 更新时输出当前值
    // }, [requestIds, refreshKey]); // 监控 Notifications 变化

// 获取Notifications
    function fetchData(requestId) {
        return fetch(`http://127.0.0.1:8080/Notification/findNotificationByRequestId/${requestId}`, {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data for requestId ${requestId}`);
                }
                return response.json();
            }).then(data => {
                console.log(`Data received for requestId ${requestId}:`, data);
                return data;
            })
            .catch(error => {
                console.error(`Error fetching data for requestId ${requestId}:`, error);
            });
    }

    // 获取UPNotifications
    function fetchData_Profile(userId) {
        return fetch(`http://localhost:8080/UPNotifications/getUPNotificationsByUserId/${userId}`, {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        })
            .then(response_profile => {
                if (!response_profile.ok) {
                    throw new Error(`Failed to fetch data for requestId ${userId}`);
                }
                return response_profile.json();
            }).then(data_profile => {
                // console.log(`Data received for requestId ${requestId}:`, data);
                return data_profile;
            })
            .catch(error => {
                console.error(`Error fetching data for requestId ${UPNotificationId}:`, error);
            });
    }

    function fetchAllData(requestIds) {
        // console.log("Request IDs to fetch data for:", requestIds);
        const promises = requestIds.map(fetchData); // 创建一个promise数组
        Promise.all(promises)
            .then(results => {
                setNotifications(results.flat());
                console.info("Notifications updated:", results.flat()); // 检查 Notifications 是否正确更新
            })
            .catch(error => {
                console.error('Error fetching all data:', error);
            });
    }

    function fetchAllData_Profile(userId) {
        fetchData_Profile(userId)
            .then(results => {
                setNotifications_Profile(results);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }

    useEffect(() => {
        if (requestIds.length > 0) { // 确保 requestIds 不是空数组
            fetchAllData(requestIds);
        }
    }, [requestIds, refreshKey]); // 当 requestIds 更新时，再次调用 fetchAllData

    // 保留fetchAllData_Profile单独执行
    useEffect(() => {
        fetchAllData_Profile(userId);
    }, [userId]); // 确保profile的通知可以独立执行

    useEffect(() => {
        // console.log("Current Notifications:", Notifications); // 每次 Notifications 更新时输出当前值
    }, [Notifications]); // 监控 Notifications 变化


    //获取notification对应walker的surname
    function fetchWalkerByNotification(notificationId) {
        return fetch(`http://127.0.0.1:8080/Notification/findWalkerByNotification/${notificationId}`, {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
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

    function fetchAllWalkers() {
        // console.log("Fetching all data for current Notifications:", Notifications); // 输出当前 Notifications
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
                // console.log("All notifications with walker data:", Notifications); // 输出合并后的通知数据
                // console.info("refreshPage"+refreshKey);
                setNotifications(results); // 更新状态
                // console.log("All notifications with walker data:", Notifications); // 输出合并后的通知数据
                // console.info("refreshPage"+refreshKey);
            })
            .catch(error => {
                console.error('Error fetching all data:', error); // 错误处理
            });
    }

    useEffect(() => {
        fetchAllWalkers();
    },[Notifications.length,refreshKey]); // 依赖于Notifications数组的变化

    // useEffect(() => {
    //     console.info(Notifications);
    //     // console.info("upup");
    //     // console.info("refreshPage"+ refreshKey);
    // }, [Notifications, refreshKey]);  // 每次Notifications更新时输出当前状态

    // 通过更新 refreshKey 来触发页面刷新
    const refreshPage = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <BackgroundLayout>
        <div className="flex flex-col h-screen p-4" style={{ overflowY: 'auto' }}>
            <Header title="Notification-parent" navigateTo={"/home-parent"} textColor={textColor} />

            {/* 保护性检查，只有当 Notifications 是非空数组时，才渲染 */}
            {Notifications && Notifications.length > 0 && Notifications.map((notification, index) => {
                console.info(notification);
                console.info("refreshPage"+refreshKey);
                if (!notification || notification.notificationClose === null || notification.notificationClose === undefined) {
                    console.error("Notification or notificationClose is null/undefined", notification);
                    return null; // 如果为 null 或 undefined，则跳过渲染
                }
                // 如果 notification.NotificationClose 为 true，则不渲染该组件
                if (notification.notificationClose === true) {
                    return null;
                }
                // console.info(notification.notificationClose);
                // console.info("upupup2");
                // console.info(notification.notificationCheck);
                // console.info("upupup3");
                return (
                    <StatusCard
                        key={index}
                        onRefresh={refreshPage}
                        title="Application Status Change"
                        statusChanged={`${notification.walkerSurname} has applied your application!`}
                        time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
                        notificationId={notification.notificationId}
                        showRedDot={!notification.notificationCheck} // 如果 NotificationCheck 为 false 则显示红点
                        role={role}
                        // 你可以定义 handleDelete 函数来处理删除逻辑

                    />
                );
            })}
            {Notifications_Profile && Notifications_Profile.length > 0 && Notifications_Profile.map((notification, index) => {
                console.info(notification);
                console.info("refreshPage"+refreshKey);
                // 如果 notification.NotificationClose 为 true，则不渲染该组件
                if (notification.notificationClose === true) {
                    return null;
                }
                // console.info(notification.notificationClose);
                // console.info("upupup2");
                // console.info(notification.notificationCheck);
                // console.info("upupup3");
                return (
                    <StatusCard_profile
                        key={index}
                        onRefresh={refreshPage}
                        title={notification.notifyType}
                        statusChanged={notification.message}
                        time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
                        notificationId={notification.notifyId}
                        showRedDot={!notification.notificationCheck} // 如果 NotificationCheck 为 false 则显示红点
                        role={role}
                        // 你可以定义 handleDelete 函数来处理删除逻辑

                    />
                );
            })}
        </div>
            </BackgroundLayout>
    );



    //原来的
    // return (
    //     <div className="flex flex-col h-screen bg-gray-100 p-4" style={{ overflowY: 'auto' }}>
    //         <Header title="Notification-parent" navigateTo={"/message"}/>
    //         {/* 保护性检查，只有当statusCards是非空数组时，才渲染 */}
    //
    //         {Notifications && Notifications.length > 0 && Notifications.map((notification, index) => (
    //             <StatusCard
    //                 key={index}
    //                 title = {"Application Status Change"}
    //                 statusChanged={`${notification.walkerSurname} has applied your application!`}
    //                 time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
    //                 notificationId={notification.notificationId}
    //                 // onDelete={() => handleDelete(index)}  // 将删除函数传递给 StatusCard
    //             />
    //         ))}
    //     </div>
    // );

    // 测试页面
    // {Notifications && Notifications.length > 0 && Notifications.map((notification, index) => {
    //     // 直接在 map 回调中执行 console.log
    //     console.log(notification);
    //     return (
    //         <div className="flex flex-col h-screen bg-gray-100 p-4" style={{ overflowY: 'auto' }}>
    //             <Header title="Notification-parent" navigateTo={"/message"} />
    //
    //             {/* 保护性检查，只有当 Notifications 是非空数组时，才渲染 */}
    //             {Notifications && Notifications.length > 0 && Notifications.map((notification, index) => {
    //
    //                 // 如果 notification.NotificationClose 为 true，则不渲染该组件
    //                 if (notification.notificationClose === true) {
    //                     return null;
    //                 }
    //                 // console.info(notification.notificationClose);
    //                 // console.info("upupup2");
    //                 // console.info(notification.notificationCheck);
    //                 // console.info("upupup3");
    //                 return (
    //                     <StatusCard
    //                         key={index}
    //                         title="Application Status Change"
    //                         statusChanged={`${notification.walkerSurname} has applied your application!`}
    //                         time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
    //                         notificationId={notification.notificationId}
    //                         showRedDot={!notification.notificationCheck} // 如果 NotificationCheck 为 false 则显示红点
    //                         onRefresh={refreshPage}
    //                         // 你可以定义 handleDelete 函数来处理删除逻辑
    //                     />
    //                 );
    //             })}
    //         </div>
    //     );
    // })}
}

