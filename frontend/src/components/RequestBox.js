import {useState} from "react";

export default function RequestBox({walkerId}){

    const myInit = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
        mode: 'cors',
        cache: 'default'
    };
    const [requestStatus, setRequestStatus] = useState('Pending...'); // 默认值为 'Pending...'

    const requestURL = new Request(`http://127.0.0.1:8080/WalkerRequest/getWalkerRequest/${walkerId}`, myInit);

    fetch(requestURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "Accepted" || data.status === "Rejected"){
                setRequestStatus(data.status);
            }})
        .catch(error => {
            console.error('Error fetching data:', error);
            setRequestStatus('This walker has not applied the request'); // 在发生错误时更新状态
        });

    return (
        <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto mt-5 border border-gray-300">
            <div className="pb-2">
                <p className="text-lg font-medium text-center">A request from Emma</p>
            </div>
            <p className={`text-center font-medium ${requestStatus === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                {/*The request has been {requestStatus}*/}
                {requestStatus === 'Accepted'|| requestStatus === 'Rejected' ?
                    <p>The request has been {requestStatus}</p> : <p>{requestStatus}</p>}
            </p>
        </div>
    )
}
// export default RequestBox;
