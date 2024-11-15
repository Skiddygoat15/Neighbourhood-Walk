"use client";

import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import useTextColor from '../../ui-background-components/useTextColor';
import BackgroundLayout from '../../ui-background-components/BackgroundLayout';


export default function MyRequestApplication({ params }) {
  const router = useRouter();
  const { id } = params;
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [request, setRequest] = useState(null);
  const [acceptedWalker, setAcceptedWalker] = useState(null); // Used to manage the accepted walker
  const textColor = useTextColor();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // format the available times
  const formatDateTime = (inputDateTime) => {
    console.log(inputDateTime);
    const dateTime = new Date(inputDateTime);
    console.log(dateTime);
    // options is a configuration object, as parameter of Intl.DateTimeFormat
    const options = {
      year: 'numeric',      // Display the full year (e.g., 2024)
      month: 'short',       // Display the abbreviated month name (e.g., Sept)
      day: 'numeric',       // Display the numeric day of the month (e.g., 16)
      weekday: 'short',     // Display the abbreviated weekday name (e.g., Mon)
      hour: 'numeric',      // Display the hour
      minute: 'numeric',    // Display the minutes
      hour12: true          // Display 12-hour time format (AM/PM)
    };
    // Using en-AU (Australia) locale
    const formattedDateTime = new Intl.DateTimeFormat('en-AU', options).format(dateTime);
    return `${formattedDateTime}`;
  };



  useEffect(() => {
    // console.log("request: ", request)
    // if (!request || !request.requestId) {
    //   return;
    // }

    const getRequestDetailsAPI = `${apiUrl}/requests/getRequestByRequestId/${id}`;
    fetch(getRequestDetailsAPI, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
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
          setRequest(data);
          if (data.walker) {
            console.log("accepted-walker:", data.walker);
            setAcceptedWalker(data.walker);
            sessionStorage.setItem("preMeetIds", [data.parent.id,data.walker.id,id])
            console.log("preMeetIds 1:", sessionStorage.getItem("preMeetIds"))
            setLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
          setError('Failed to get request details. Please try again.');
          setLoading(false);
        });
  }, [id]);

  // Get a list of applicants
  useEffect(() => {
    if (!request || !request.requestId || acceptedWalker) {
      return;
    }

    const getWalkersAPI = `${apiUrl}/WalkerRequest/getWalkersByRequestId/${id}`;
    fetch(getWalkersAPI, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
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
          setWalkers(data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setError('Failed to get walker list. Please try again.');
          setLoading(false);
        });
  }, [request, acceptedWalker]);

  // Listen for changes in the state of walkers
  useEffect(() => {
    if (walkers && walkers.length > 0) {
      console.log("Updated walkers:", walkers);
    }
  }, [walkers]);

  // Handle the request to accept the walker
  const acceptWalker = (walkerId) => {
    const acceptAPI = `${apiUrl}/requests/${id}/accept?walkerId=${walkerId}`;
    console.log("acceptAPI: " + acceptAPI)
    fetch(acceptAPI, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
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
          sessionStorage.setItem("preMeetIds", [request.parent.id, walkerId, id])
          console.log("preMeetIds 2:", sessionStorage.getItem("preMeetIds"))
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
    const rejectAPI = `${apiUrl}/requests/${id}/reject?walkerId=${walkerId}`;
    console.log("rejectAPI: " + rejectAPI)
    fetch(rejectAPI, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
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

  if (loading) {
    return <BackgroundLayout>
    <main className="min-h-screen">
      <h1 className="text-2xl font-bold text-center mt-10">My Request Application</h1>

      <div className="mx-auto p-16 space-y-8">
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        <div className="border rounded-lg space-y-2 mt-20">
          <div className="flex justify-between">
            <span className="font-bold">Trip request</span>
            <button className="text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                   className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 11c1.1 0 2-.9 2-2V7m-4 2c0 1.1.9 2 2 2zm0 0c1.1 0 2 .9 2 2v1m-4-3c0 1.1-.9 2-2 2v1m-4-1c1.1 0 2-.9 2-2zm10 5c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-7c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-9c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2z"/>
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm">Departure: Loading...</p>
          <p className="text-gray-600 text-sm">Destination: Loading...</p>
          <p className="text-gray-600 text-sm">Estimated time: Loading... - Loading...</p>
          <p className="text-sm text-gray-500">Published by Loading...</p>

          <h2 className="font-bold">Applicants:</h2>
          {acceptedWalker ? (
              <div className="border p-4 rounded-lg space-y-2">
                <div className="flex items-center">
                  <span className="text-lg font-bold">You have accepted Loading... application!</span>
                  <div className="flex items-center ml-auto">
                    <button className="text-red-500 ml-4"
                            onClick={() => router.push("/pre-meet-parent")}>Pre-meet
                    </button>
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
                            <button className="text-red-500 ml-4" onClick={() => rejectWalker(walker.id)}>Reject
                            </button>
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
    </BackgroundLayout>
  }
  if (error) return <p>{error}</p>;
  return (
    <BackgroundLayout>
      <main className="min-h-screen">
        <button onClick={() => router.back()} className={`text-2xl ${textColor} p-2 focus:outline-none`}>
          &larr;
        </button>
        <h1 className={`text-2xl ${textColor} font-bold text-center mb-10`}>My Request Application</h1>

        <div className="mx-4">
          <div className="border p-4 bg-white rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-bold">Trip request</span>
              <button className="text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 11c1.1 0 2-.9 2-2V7m-4 2c0 1.1.9 2 2 2zm0 0c1.1 0 2 .9 2 2v1m-4-3c0 1.1-.9 2-2 2v1m-4-1c1.1 0 2-.9 2-2zm10 5c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-7c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-9c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2z"/>
                </svg>
              </button>
            </div>
            <p className="text-gray-600 text-sm">Departure: {request.departure}</p>
            <p className="text-gray-600 text-sm">Destination: {request.destination}</p>
            <p className="text-gray-600 text-sm">
              Estimated time: {formatDateTime(request.startTime)} - {formatDateTime(request.arriveTime)}
            </p>
            <p className="text-sm text-gray-500">Published by {formatDateTime(request.publishDate)}</p>

            <h2 className="font-bold">Applicants:</h2>
            {acceptedWalker ? (
                <div className="border p-4 rounded-lg space-y-2">
                  <div className="flex items-center">
                    <span className="text-lg font-bold">You have accepted {acceptedWalker.name} application!</span>
                    <div className="flex items-center ml-auto">
                      <button className="text-red-500 ml-4"
                              onClick={() => router.push("/pre-meet-parent")}>Pre-meet
                      </button>
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
                              <button className="text-red-500 ml-4" onClick={() => rejectWalker(walker.id)}>Reject
                              </button>
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
    </BackgroundLayout>
  );
}
