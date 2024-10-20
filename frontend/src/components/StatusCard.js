// components/StatusCard.js
// import React, {useState} from 'react';
//
// export default function StatusCard({ title, statusChanged, time}) {
//
//     const userId = localStorage.getItem('userId');
//     const [role, setRole] = useState(localStorage.getItem('roles'));
//     const [RequestStatus,setRequestStatus] = useState("Pending...");
//     // const [parentId, setparentId] = useState();
//     const myInit = {
//         method: 'GET',
//         headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
//         mode: 'cors',
//         cache: 'default'
//     };
//
//     const requestURL = new Request(`http://127.0.0.1:8080/WalkerRequest/getWalkerRequestByWalkerId/${userId}`, myInit);
//     fetch(requestURL)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             console.info(response.json())
//             return response.json();
//         })
//         .then(data => {
//             if (data.status === "Accepted" || data.status === "Rejected" || data.status === "Pending...") {
//                 setRequestStatus(data.status);
//             }})
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
//
//     const [showDot, setShowDot] = useState(true);  // 初始状态为显示小红点
//     // 点击事件处理函数，用于隐藏小红点
//     const handleClick = () => {
//         setShowDot(false);  // 点击后设置状态为不显示
//     };
//
//     const getStatusStyle = (status) => {
//         switch(status) {
//             case 'Accepted':
//                 return { color: 'green', fontWeight: 'bold',marginBottom: '8px' };
//             case 'Rejected':
//                 return { color: 'red', fontWeight: 'bold',marginBottom: '8px' };
//             case 'Pending...':
//                 return { color: 'blue', fontWeight: 'bold',marginBottom: '8px' };
//             default:
//                 return { color: 'black', fontWeight: 'bold',marginBottom: '8px' };
//         }
//     };
//     return (
//         <div style={{
//             border: '1px solid #ccc',
//             borderRadius: '8px',
//             padding: '10px',
//             position: 'relative', // 设置容器为相对定位
//             margin: '10px 0',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between'
//         }} onClick={handleClick}>
//
//             {showDot && (
//                 <span style={{
//                     position: 'absolute', // 小红点的定位为绝对
//                     top: '10px',          // 从顶部10px的位置
//                     right: '10px',        // 从右侧10px的位置
//                     height: '10px',
//                     width: '10px',
//                     borderRadius: '50%',
//                     backgroundColor: 'red',  // 小红点为红色
//                 }}></span>
//             )}
//             <div style={{marginBottom: '8px'}}>
//                 <strong>{title}</strong>
//             </div>
//             {/*<div style={{marginBottom: '8px'}}>*/}
//             {/*    <strong>ParentSurname:</strong> {parentSurname}*/}
//             {/*</div>*/}
//             {/*<div style={{marginBottom: '8px'}}>*/}
//             {/*    <strong>Walker ID:</strong> {walkerId}*/}
//             {/*</div>*/}
//             {/*<div style={{marginBottom: '8px'}}>*/}
//             {/*    <strong>StatusPrevious: </strong>*/}
//             {/*    <span style={getStatusStyle(statusPrevious)}>{statusPrevious}</span>*/}
//             {/*</div>*/}
//             <div style={{marginBottom: '8px'}}>
//                 {/*<strong>StatusChanged: </strong>*/}
//                 <span style={getStatusStyle(statusChanged)}>{statusChanged}</span>
//             </div>
//             <div>
//                 {/*<strong>Time:</strong> */}
//                 {time}
//             </div>
//             {/*<button onClick={onDelete} className="delete-button"*/}
//             {/*        style={{position: 'absolute', right: '10px', top: '10px'}}>*/}
//             {/*    X*/}
//             {/*</button>*/}
//         </div>
//     );
// }


import React, {useEffect, useState} from 'react';

export default function StatusCard({ showRedDot, title, statusChanged, time, notificationId, role}) {

    const userId = localStorage.getItem('userId');
    // const [role, setRole] = useState(localStorage.getItem('roles'));
    const [RequestStatus, setRequestStatus] = useState("Pending...");
    const myInit = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
        mode: 'cors',
        cache: 'default'
    };

    // 初始化通知状态
    const requestURL = new Request(`http://127.0.0.1:8080/WalkerRequest/getWalkerRequestByWalkerId/${userId}`, myInit);

    console.log("showRedDot value:", showRedDot);


    fetch(requestURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "Accepted" || data.status === "Rejected" || data.status === "Pending...") {
                setRequestStatus(data.status);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // const [showDot, setShowDot] = useState(true);  // 初始状态为显示小红点

    // useEffect(() => {
    //     setShowDot(showRedDot); // 同步父组件传入的 showRedDot
    // }, [showRedDot]);

    // 点击事件处理函数，用于隐藏小红点并调用检查通知接口
    const handleClick = () => {
        // setShowDot(false);  // 点击后设置状态为不显示
        // 调用后端接口检查通知
        fetch(`http://127.0.0.1:8080/Notification/checkNotification/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                console.error("Failed to check notification");
            }else{
                // console.info(role);
                // console.info("role is up")
                if (role === 'parent'){
                    // console.info("parent");
                    window.location.href = `/notification-parent`;
                }
                if (role === 'walker'){
                    // console.info("walker");
                    window.location.href = `/notification-walker`;
                }
            }
        }).catch(error => {
            console.error('Error checking notification:', error);
        });
    };

    // 关闭通知函数
    const handleCloseNotification = () => {
        // 调用后端接口关闭通知
        fetch(`http://127.0.0.1:8080/Notification/closeNotification/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                console.error("Failed to close notification");
            }else{
                // console.info(role);
                // console.info("role is up")
                if (role.includes("parent")){
                    // console.info("parent");
                    window.location.href = `/notification-parent`;
                }
                if (role.includes("walker")){
                    // console.info("walker");
                    window.location.href = `/notification-walker`;
                }
        }}).catch(error => {
            console.error('Error closing notification:', error);
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Accepted':
                return { color: 'green', fontWeight: 'bold', marginBottom: '8px' };
            case 'Rejected':
                return { color: 'red', fontWeight: 'bold', marginBottom: '8px' };
            case 'Pending...':
                return { color: 'blue', fontWeight: 'bold', marginBottom: '8px' };
            default:
                return { color: 'black', fontWeight: 'bold', marginBottom: '8px' };
        }
    };

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            position: 'relative', // 设置容器为相对定位
            margin: '10px 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'white'
        }}>
            {/*<div style={{marginBottom: '8px', color: 'blue'}}>*/}
            {/*    <strong>showRedDot: {showRedDot === true ? 'true' : 'false'}</strong>*/}
            {/*    /!*<br></br>*!/*/}
            {/*    /!*<strong>showDot: {showRedDot === true ? 'true' : 'false'}</strong>*!/*/}
            {/*</div>*/}
            {showRedDot && (
                <span style={{
                    position: 'absolute', // 小红点的定位为绝对
                    bottom: '10px',          // 从底部10px的位置
                    right: '10px',        // 从右侧10px的位置
                    height: '10px',
                    width: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red',  // 小红点为红色
                }}></span>
            )}

            <div style={{marginBottom: '8px'}} >
                <strong onClick={handleClick}>{title}</strong>
            </div>

            <div style={{marginBottom: '8px'}} >
                <span style={getStatusStyle(statusChanged)} onClick={handleClick}>{statusChanged}</span>
            </div>

            <div>
                <span onClick={handleClick}>{time}</span>
            </div>

            {/* 右上角的关闭按钮 */}
            <button onClick={handleCloseNotification} style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#ccc'
            }}>
                X
            </button>

        </div>
    );
}