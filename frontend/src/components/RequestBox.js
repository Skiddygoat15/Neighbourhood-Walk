"use client"
import {useState} from "react";

export default function RequestBox({walkerId}){
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const myInit = {
        method: 'get', // Method is GET to fetch data
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json', // Set the content type header for JSON data
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
    };
    const [requestStatus, setRequestStatus] = useState('Pending...'); // The default value is 'Pending...'

    const requestURL = new Request(`${apiUrl}/WalkerRequest/getWalkerRequest/${walkerId}`, myInit);

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
            }})
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Accepted':
                return { color: 'green', fontWeight: 'bold' };
            case 'Rejected':
                return { color: 'red', fontWeight: 'bold' };
            case 'Pending...':
                return { color: 'blue', fontWeight: 'bold' };
            default:
                return { color: 'black', fontWeight: 'bold' };
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto mt-5 border border-gray-300">
            <div className="pb-2">
                <p className="text-lg font-medium text-center">A request from Emma</p>
            </div>
            <p className={'text-center font-medium'}style={getStatusStyle(requestStatus)}>
                {requestStatus === 'Accepted' || requestStatus === 'Rejected' ?
                    <p>The request has been ({requestStatus})</p> : <p>({requestStatus})</p>}
            </p>
        </div>
    )
}
// export default RequestBox;
