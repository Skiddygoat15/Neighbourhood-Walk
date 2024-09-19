"use client";

import {useRouter} from 'next/navigation';

// import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';


export default function MyRequestApplication({ params }) {
  const router = useRouter();
  const { id } = params;
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [request, setRequest] = useState(null); // 使用 useState 管理 request
  const [acceptedWalker, setAcceptedWalker] = useState(null); // 用于管理被接受的 walker
  // 第一次渲染时，获取 localStorage 中的 request 数据
  // useEffect(() => {
  //   const storedRequest = localStorage.getItem('clickedRequest');
  //   //console.log("storedRequest: ", storedRequest);
  //   if (storedRequest) {
  //     setRequest(JSON.parse(storedRequest));
  //     console.log("clickedRequest", request);
  //   }
  // }, []); // 空数组作为依赖，确保只在组件挂载时执行一次


  useEffect(() => {
    // console.log("request: ", request)
    // if (!request || !request.requestId) {
    //   // 如果 request 为空或 requestId 不存在，不执行 API 调用
    //   return;
    // }

    const getRequestDetailsAPI = `http://127.0.0.1:8080/requests/getRequestByRequestId/${id}`;
    fetch(getRequestDetailsAPI, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              alert('Please log in.');
              router.push('/Login');
              return;
            }
            return response.json().then(data => {
              alert(data.message);
              setError(data.message);
              throw new Error(data.message || "Error getting request details");
            });
          }
          return response.json();
        })
        .then(data => {
          console.log("get request:", data);
          setRequest(data); // 更新 request 数据
          if (data.walker) {
            console.log("accepted-walker:", data.walker);
            setAcceptedWalker(data.walker); // 设置被接受的 walker
            setLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
          setError('Failed to get request details. Please try again.');
          setLoading(false);
        });
  }, [id]); // 根据 requestId 触发

  // 获取申请者列表
  useEffect(() => {
    if (!request || !request.requestId || acceptedWalker) {
      return;
    }

    const getWalkersAPI = `http://127.0.0.1:8080/WalkerRequest/getWalkersByRequestId/${id}`;
    fetch(getWalkersAPI, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              alert('Please log in.');
              router.push('/Login');
              return;
            }
            return response.text().then(text => {
              //setError(text);
              alert(text);
              throw new Error(text || "Error fetching request");
            });
          }
          return response.json();
        })
        .then(data => {
          console.log("get walkers: ", data)
          setWalkers(data); // 设置 walkers 数据
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setError('Failed to get walker list. Please try again.');
          setLoading(false);
        });
  }, [request, acceptedWalker]); // 根据 request 和 acceptedWalker 触发

  // 监听 walkers 状态的变化
  useEffect(() => {
    if (walkers && walkers.length > 0) {
      console.log("Updated walkers:", walkers);
    }
  }, [walkers]);

  // 处理接受 walker 的请求
  const acceptWalker = (walkerId) => {
    const acceptAPI = `http://127.0.0.1:8080/requests/${id}/accept?walkerId=${walkerId}`;
    console.log("acceptAPI: " + acceptAPI)
    fetch(acceptAPI, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              //setError(text);
              alert(text);
              throw new Error(text || "Error accepting walker");
            });
          }
          alert('Request accepted successfully.');
          setAcceptedWalker(walkers.find(walker => walker.id === walkerId));
          setWalkers(walkers.filter(walker => walker.id === walkerId));
          //router.reload(); // 刷新页面
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          alert('Failed to accept walker. Please try again.');
          setLoading(false);
        });
  };

  // 处理拒绝 walker 的请求
  const rejectWalker = (walkerId) => {
    const rejectAPI = `http://127.0.0.1:8080/requests/${id}/reject?walkerId=${walkerId}`;
    console.log("rejectAPI: " + rejectAPI)
    fetch(rejectAPI, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              //setError(text);
              alert(text);
              throw new Error(text || "Error rejecting walker");
            });
          }
          alert('Request rejected successfully.');
          setWalkers(walkers.filter(walker => walker.id !== walkerId));
          //router.reload(); // 刷新页面
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          alert('Failed to reject walker. Please try again.');
        });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
      <main className="min-h-screen bg-white">
        <div className="max-w-md mx-auto p-4 space-y-8">
          {/* 返回按钮 */}
          <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
            &larr;
          </button>
          {/* 标题 */}
          <h1 className="text-2xl font-bold text-center">My Request Application</h1>

          {/* 展示 request 详情 */}
          <div className="border p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-bold">Trip request</span>
              <button className="text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.1 0 2-.9 2-2V7m-4 2c0 1.1.9 2 2 2zm0 0c1.1 0 2 .9 2 2v1m-4-3c0 1.1-.9 2-2 2v1m-4-1c1.1 0 2-.9 2-2zm10 5c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-7c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-9c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2z" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 text-sm">Departure: {request.departure}</p>
            <p className="text-gray-600 text-sm">Destination: {request.destination}</p>
            <p className="text-gray-600 text-sm">Estimated time: {request.startTime} - {request.arriveTime}</p>
            <p className="text-sm text-gray-500">Published by {request.publishDate}</p>

            {/* 展示申请人 */}
            <h2 className="font-bold">Applicants:</h2>
            {acceptedWalker ? (
                <div className="border p-4 rounded-lg space-y-2">
                  <div className="flex items-center">
                    <span className="text-lg font-bold">You have accepted {acceptedWalker.name} application!</span>
                    <div className="flex items-center ml-auto">
                      <button className="text-red-500 ml-4" onClick={() => router.push("/notification-homepage")}>Pre-meet</button>
                    </div>
                  </div>
                </div>
            ) : (
                walkers.length > 0 ? (
                    walkers.map(walker => (
                        <div key={walker.id} className="border p-4 rounded-lg space-y-2">
                          <div className="flex items-center">
                            <span className="text-lg font-bold">{walker.name} applied for your request!</span>
                            <div className="flex items-center ml-auto">
                              <button className="text-green-500" onClick={() => acceptWalker(walker.id)}>Accept</button>
                              <button className="text-red-500 ml-4" onClick={() => rejectWalker(walker.id)}>Reject</button>
                            </div>
                          </div>
                        </div>
                    ))
                ) : (
                    <p>No applicants found.</p>
                )
            )}
          </div>
        </div>
      </main>
  );
}
