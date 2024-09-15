// components/StatusCard.js
import React, {useState} from 'react';

export default function StatusCard({ parentId, walkerId, status, time }) {
    const myInit = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
        mode: 'cors',
        cache: 'default'
    };

    const [role, setRole] = useState('parent');

    const requestURL = new Request(`http://127.0.0.1:8080/WalkerRequest/getWalkerRequestByWalkerId/${walkerId}`, myInit);
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

            <div style={{ marginBottom: '8px' }}>
                <strong>Parent ID:</strong> {parentId}
            </div>
            <div style={{ marginBottom: '8px' }}>
                <strong>Walker ID:</strong> {walkerId}
            </div>
            <div style={{ marginBottom: '8px' }}>
                <strong>Status: </strong>
                <span style={getStatusStyle(status)}>{status}</span>
            </div>
            <div>
                <strong>Time:</strong> {time}
            </div>
        </div>
    );
}
