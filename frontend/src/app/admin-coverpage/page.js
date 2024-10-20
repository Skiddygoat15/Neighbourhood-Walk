// src/app/Admin/page.js
"use client";

// import React, { useEffect, useState } from 'react';
import {useRouter} from "next/navigation";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const router = useRouter();
  const textColor = useTextColor();

    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        offlineUsers: 0,
    });

    const [requestStats, setRequestStats] = useState({
        totalRequests: 0,
        publishedRequests: 0,
        acceptedRequests: 0,
        finishedRequests: 0,
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserStats();
        fetchRequestStats();
    }, []);

    const fetchUserStats = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8080/Users/stats', {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            const data = await response.json();
            setUserStats(data);
        } catch (error) {
            setError('Failed to fetch user stats.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRequestStats = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8080/requests/stats', {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            const data = await response.json();
            setRequestStats(data);
        } catch (error) {
            setError('Failed to fetch request stats.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <BackgroundLayout>
          {/* Admin Dashboard Title */}
                <h1 className={`text-3xl font-bold text-center mt-8 mb-4 ${textColor}`}>Admin Dashboard</h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">

              {/* User Statistics Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Statistics</h2>
                  {loading ? (
                      <p>Loading stats...</p>
                  ) : (
                      <>
                          <p className="text-gray-600"><strong>Total Users:</strong> {userStats.totalUsers}</p>
                          <p className="text-gray-600"><strong>Active Users:</strong> {userStats.activeUsers}</p>
                          <p className="text-gray-600"><strong>Offline Users:</strong> {userStats.offlineUsers}</p>
                      </>
                  )}
                  {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>

              {/* Request Statistics Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Request Statistics</h2>
                  {loading ? (
                      <p>Loading stats...</p>
                  ) : (
                      <>
                          <p className="text-gray-600"><strong>Total Requests:</strong> {requestStats.totalRequests}</p>
                          <p className="text-gray-600"><strong>Published
                              Requests:</strong> {requestStats.publishedRequests}</p>
                          <p className="text-gray-600"><strong>Accepted
                              Requests:</strong> {requestStats.acceptedRequests}</p>
                          <p className="text-gray-600"><strong>Finished
                              Requests:</strong> {requestStats.finishedRequests}</p>
                      </>
                  )}
                  {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>
          </div>

          {/* Management Buttons Section */}
              <div className="space-y-2 items-center w-full max-w-sm mt-60">
                  <button
                      onClick={() => router.push("/admin-user-management")}
                      className="w-full mt-2 bg-blue-600 text-white py-3 rounded-lg border-black shadow-lg hover:bg-blue-900 transition duration-100"
                  >
                      User Management
                  </button>

              <button
                      onClick={() => router.push("/admin-content-management")}
                      className="w-full mt-2 bg-green-600 text-white py-3 rounded-lg shadow-lg hover:bg-green-900 transition duration-100"
                  >
                      Content Management
                  </button>
              </div>
      </BackgroundLayout>

  );
}
