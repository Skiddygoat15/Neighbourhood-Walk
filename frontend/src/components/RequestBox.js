import {useState} from "react";

export default function RequestBox({walkerId}){

    const myHeaders = new Headers();

    const myInit = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    const [requestStatus, setRequestStatus] = useState('Pending...'); // 默认值为 'Pending...'

    const requestURL = new Request('http://127.0.0.1:8080/WalkerRequest/getRequest/{walkerId}', myInit);

    fetch(requestURL)
        .then(response => response.json())
        .then(data => {
            // 假设响应的数据结构是 { status: 'Accepted' }
            if (data.status === 'Accepted') {
                setRequestStatus(data.status); // 更新状态
            }else if(data.status === 'Rejected'){
                setRequestStatus(data.status);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setRequestStatus('Error fetching data'); // 设置错误信息
        });
    return (
        <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto mt-5 border border-gray-300">
            <div className="pb-2">
                <p className="text-lg font-medium text-center">A request from Emma</p>
            </div>
            <p className={`text-center font-medium ${requestStatus === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                The request has been {requestStatus}
            </p>
        </div>
    )
}
// export default RequestBox;
