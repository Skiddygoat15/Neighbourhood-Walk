// pages/Search-Parent.js
"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function SearchParent() {
  const router = useRouter();
  const [gender, setGender] = useState('');
  const [distance, setDistance] = useState('');
  const [rating, setRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [walkers, setWalkers] = useState([]);  // 保存返回的 walkers 列表
  const [error, setError] = useState(null);    // 用于保存错误信息

  const handleClear = () => { setSearchTerm(''); };// 清空输入框内容

  const searchWalkersAPI = `http://127.0.0.1:8080/Users/searchWalkers?searchTerm=${searchTerm}`;
  const handleSearch = async () => {
    setWalkers([]); // 点击搜索按钮时先清空之前的结果
    setError(null); // 清空之前的错误消息

    try {
      const response = await fetch(searchWalkersAPI, {
        method: 'get',  // 使用 GET 方法
        credentials: 'include',  // 包含用户凭证
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      console.log(response);

      // 检查响应的Content-Type是否为application/json
      const contentType = response.headers.get('Content-Type');
      if (!response.ok) {
        if (response.status === 403) {
          alert('Please log in.');
          // router.push('/Login');
          return;
        }

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error fetching walkers');
        } else {
          throw new Error('Unexpected non-JSON response');
        }
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setWalkers(data);  // 保存返回的 walkers 列表
        setError(null);    // 清空错误信息
      } else {
        throw new Error('Invalid response type, expected JSON');
      }
    } catch (error) {
      console.error("Search request failed:", error);
      setError(error.message || 'An unknown error occurred.');
      setWalkers([]); // 如果出错，清空walker列表
    }

  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto mt-4">
  
        <h1 className="text-2xl font-semibold mb-4">Search</h1>

        <div className="relative mb-4">
          <div className="flex items-center space-x-2 mb-2">

            <div className="relative w-full">
              {/* 输入框，输入搜索 walker 的关键字 */}
              <input
                  type="text"
                  placeholder="Search walkers.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow p-2 border rounded-lg w-full"
              />
              {/* 清空按钮 */}
              <button
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 按钮触发搜索 */}
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Search
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </div>


        <div className="flex justify-between mb-4">
    
          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

     
          <div className="relative">
            <select
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Distance</option>
              <option value="1km">Within 1km</option>
              <option value="2km">Within 2km</option>
            </select>
          </div>


          <div className="relative">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Ratings</option>
              <option value="5stars">5 stars</option>
              <option value="4stars">4 stars & up</option>
              <option value="3stars">3 stars & up</option>
              <option value="2stars">2 stars & up</option>
              <option value="1stars">1 stars & up</option>
            </select>
          </div>

        </div>


        {/* 显示返回的 walker 列表 */}
        <div className="space-y-4 mt-4">
          {walkers.length > 0 ? (
              walkers.map((walker) => (
                  <div key={walker.id} className="border rounded-lg p-4 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div>
                      <p className="font-semibold">Walker Name: {`${walker.name} ${walker.surname}`}</p>
                      <p>Gender: {walker.gender}</p>
                      <p>Address: {walker.address}</p>
                    </div>
                  </div>
              ))
          ) : (
              <p className="text-center">No walkers found</p>
          )}
        </div>

      </div>
    </div>
  );
}
