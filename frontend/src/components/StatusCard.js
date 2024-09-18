// components/StatusCard.js
import React, {useState} from 'react';

export default function StatusCard({ title, statusChanged, time}) {

    const userId = localStorage.getItem('userId');
    const [role, setRole] = useState(localStorage.getItem('roles'));
    const [RequestStatus,setRequestStatus] = useState("Pending...");
    // const [parentId, setparentId] = useState();
    const myInit = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
        mode: 'cors',
        cache: 'default'
    };

    const requestURL = new Request(`http://127.0.0.1:8080/WalkerRequest/getWalkerRequestByWalkerId/${userId}`, myInit);
    fetch(requestURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.info(response.json())
            return response.json();
        })
        .then(data => {
            if (data.status === "Accepted" || data.status === "Rejected" || data.status === "Pending...") {
                setRequestStatus(data.status);
            }})
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    const [showDot, setShowDot] = useState(true);  // 初始状态为显示小红点
    // 点击事件处理函数，用于隐藏小红点
    const handleClick = () => {
        setShowDot(false);  // 点击后设置状态为不显示
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Accepted':
                return { color: 'green', fontWeight: 'bold',marginBottom: '8px' };
            case 'Rejected':
                return { color: 'red', fontWeight: 'bold',marginBottom: '8px' };
            case 'Pending...':
                return { color: 'blue', fontWeight: 'bold',marginBottom: '8px' };
            default:
                return { color: 'black', fontWeight: 'bold',marginBottom: '8px' };
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
            justifyContent: 'space-between'
        }} onClick={handleClick}>

            {showDot && (
                <span style={{
                    position: 'absolute', // 小红点的定位为绝对
                    top: '10px',          // 从顶部10px的位置
                    right: '10px',        // 从右侧10px的位置
                    height: '10px',
                    width: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red',  // 小红点为红色
                }}></span>
            )}
            <div style={{marginBottom: '8px'}}>
                <strong>{title}</strong>
            </div>
            {/*<div style={{marginBottom: '8px'}}>*/}
            {/*    <strong>ParentSurname:</strong> {parentSurname}*/}
            {/*</div>*/}
            {/*<div style={{marginBottom: '8px'}}>*/}
            {/*    <strong>Walker ID:</strong> {walkerId}*/}
            {/*</div>*/}
            {/*<div style={{marginBottom: '8px'}}>*/}
            {/*    <strong>StatusPrevious: </strong>*/}
            {/*    <span style={getStatusStyle(statusPrevious)}>{statusPrevious}</span>*/}
            {/*</div>*/}
            <div style={{marginBottom: '8px'}}>
                {/*<strong>StatusChanged: </strong>*/}
                <span style={getStatusStyle(statusChanged)}>{statusChanged}</span>
            </div>
            <div>
                {/*<strong>Time:</strong> */}
                {time}
            </div>
            {/*<button onClick={onDelete} className="delete-button"*/}
            {/*        style={{position: 'absolute', right: '10px', top: '10px'}}>*/}
            {/*    X*/}
            {/*</button>*/}
        </div>
    );
}
