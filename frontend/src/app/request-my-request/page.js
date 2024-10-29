"use client";

import { useRouter } from 'next/navigation';
import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function MyRequest() {
  const moment = require('moment');
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const textColor = useTextColor();
  const [formattedStartTime, setFormattedStartTime] = useState("00:00:00");
  const [formattedArriveTime, setFormattedArriveTime] = useState("00:00:00");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [parentId, setParentId] = useState();

  useEffect(() => {
    // 从 sessionStorage 获取 userId 并更新 parentId
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setParentId(storedUserId);
    }
  }, []);

  useEffect(() => {
      if (parentId) {
        getRequestsList(); // 在 parentId 更新后调用 API
      }
    }, [parentId]);


  function getRequestsList() {
    const getRequestsListAPI = `${apiUrl}/requests/getRequestsByParentId/${parentId}`
    console.log("current userId: " + parentId)
    fetch(getRequestsListAPI, {
      method: 'get', // Method is GET to fetch data
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // Set the content type header for JSON data
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      },
    })
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              alert('Please log in.');
              router.push('/Login');
              return;
            }
            return response.json().then(data => {
              alert(data.message)
              setError(data.message)
              throw new Error(data.message || "error getting requestList");
            });
          }
          return response.json();
        })
        .then(data => {
          console.log("get requestsList successful", data)
          // setContributions(data.data.filter(item =>
          //     item.status === "Pending" && item.action !== "DeleteCharacter"));
          setRequestList(data);
          setLoading(false);
          setError('');
        })
        .catch(err => {
          console.log(err);
          //setError('Failed to get contribution. Please try again.');
          setLoading(false);
        });
  }

  function deleteRequest(requestId) {
    console.log('requestId', requestId);
    fetch(`${apiUrl}/requests/${requestId}`, {
      method: 'DELETE', // DELETE 方法用于删除请求
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // 设置请求头为 JSON 类型
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      },
    })
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
              alert(data.message);
              throw new Error(data.message || "error deleting request");
            });
          }
          alert('Request deleted successfully');
          // 成功删除后，你可以刷新请求列表
          getRequestsList();
        })
        .catch(err => {
          console.error(err);
          alert('Failed to delete request');
        });
  }


  return (
      <BackgroundLayout>
      <main className="min-h-screen pb-20">
        {/* Back Button */}
          <button onClick={() => router.back()} className={`text-2xl ${textColor} p-4 text-left`}>
            &larr;
          </button>

        <div className="max-w-md mx-auto p-4 space-y-8 sm:max-w-lg md:max-w-xl lg:max-w-2xl">

            {/* Title and Create Button */}
            <div className="flex justify-between items-center">
              <h1 className={`text-2xl font-bold sm:text-3xl lg:text-4xl ${textColor}`}>My request</h1>
              <button
                  onClick={() => router.push('/request-create')}
                  className="py-2 px-4 bg-black text-white rounded-full font-semibold sm:py-3 sm:px-5 lg:py-4 lg:px-6"
              >
                Create new request
              </button>
            </div>

            {/* Request Items */}
            {loading ? (
                <p>Loading...</p>
            ) : requestList.length === 0 ? (
                <p>You haven't created any requests yet.</p>
            ) : (
                <div className="space-y-4">
                  {requestList.map((request, index) => (
                      <div key={index} className="border p-4 bg-white rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-bold sm:text-xl lg:text-2xl">Trip request</h2>
                          <button
                              onClick={() => {
                                // sessionStorage.setItem('clickedRequest', JSON.stringify(request));
                                router.push(`/request-my-request-application/${request.requestId}`);
                              }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor"
                                 className="w-6 h-6 sm:w-8 sm:h-8">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/>
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm sm:text-base"><strong>Departure:</strong> {request.departure}</p>
                        <p className="text-sm sm:text-base"><strong>Destination:</strong> {request.destination}</p>
                        <p className="text-sm sm:text-base"><strong>Estimated
                          time:</strong> {moment(request.startTime).format("MM/DD/YYYY HH:mm")}</p>
                        <p className="text-sm sm:text-base"><strong>arrive
                          time:</strong> {moment(request.arriveTime).format("MM/DD/YYYY HH:mm")}</p>
                        <p className="text-xs text-gray-500 sm:text-sm">Published
                          by {moment(request.publishDate).format("MM/DD HH:mm")}</p>
                        <div className="flex justify-between mt-2">
                          <button
                              onClick={() => {
                                sessionStorage.setItem('updateRequest', JSON.stringify(request));
                                router.push('/request-update');
                              }}
                              className="py-2 px-4 bg-black text-white rounded-full text-sm font-semibold sm:py-3 sm:px-5"
                          >
                            Update
                          </button>
                          <button
                              onClick={() => deleteRequest(request.requestId)}
                              className="py-2 px-4 bg-black text-white rounded-full text-sm font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>
      </main>
      </BackgroundLayout>
  );
}
