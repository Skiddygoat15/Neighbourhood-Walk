// components/RequestBox.js
import {useState} from "react";

export default function RequestBox({status}){
    // function getRequestsList() {
    //
    //     const [walkerId, setwalkerId] = useState(2);
    //     const getRequestsListAPI = `http://127.0.0.1:8080/requests/${requestId}/accept`;
    //
    //     fetch(getRequestsListAPI, {
    //         method: 'get', // Method is GET to fetch data
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json', // Set the content type header for JSON data
    //             'Authorization': 'Bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb2huLmRvZTMyMTFAa2ouY29tIiwiZXhwIjoxNzI1OTg2MTg5fQ.pEX9PUkjQdO8uE_8vdfXCUkq_7mP9RiUSiZJTBAxmKNbATKzD6rn6FnKCSpH4Oxt0rPar41tW2giezVml2R8UA"   //localStorage.getItem('token')
    //         },
    //     };
    // }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto mt-5 border border-gray-300">
            <div className="pb-2">
                <p className="text-lg font-medium text-center">A request from Emma</p>
            </div>
<<<<<<< Updated upstream
            <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between mt-2">
                    <button
                        className="flex-1 bg-gray-300 text-black py-2 px-4 rounded-l hover:bg-gray-400
                        transition duration-300 ease-in-out focus:outline-none focus:shadow-outline">
                        Accept
                    </button>
                    <button
                        className="flex-1 bg-gray-300 text-black py-2 px-4 rounded-r hover:bg-gray-400
                        transition duration-300 ease-in-out focus:outline-none focus:shadow-outline">
                        Reject
                    </button>
                </div>
            </div>
=======
            <p className={`text-center font-medium ${status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                The request has been {status}
            </p>
>>>>>>> Stashed changes
        </div>
    )
}
// export default RequestBox;
