// pages/Search-Parent.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';

export default function SearchParent() {
  const router = useRouter();
  const parentId = localStorage.getItem('userId');
  const [gender, setGender] = useState('');
  const [distance, setDistance] = useState('');
  const [rating, setRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [walkers, setWalkers] = useState([]);  // store walkers list
  const [error, setError] = useState(null);    // store error message
  const [textColor, setTextColor] = useState('text-black');

  // 第一个参数：() => {} 是一个回调函数，称为副作用函数。当 React 渲染组件时，React 会执行这个函数。
  // 第二个参数：[依赖项] 是一个依赖数组，当这个数组中的变量发生变化时，useEffect 会重新执行。
  useEffect(() => {
    if (searchTerm === '') {
      handleSearch();  // 如果搜索框清空，执行搜索所有walkers
    }
  }, [searchTerm, gender, distance, rating]);

  useEffect(() => {
    // 设置字体颜色基于当前时间
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 17) {
      setTextColor('text-black');  // 上午和下午使用黑色字体
    } else {
      setTextColor('text-white');  // 晚上和午夜使用白色字体
    }
  }, []);

  const handleClear = () => {
    setSearchTerm('');
    setGender('');
    setDistance('');
    setRating('');
  }; // empty searchTerm and all filters

  const handleSearch = async () => {
    setWalkers([]); // 点击搜索按钮时先清空之前的结果
    setError(null); // 清空之前的错误消息

    const searchWalkersAPI = `http://127.0.0.1:8080/Users/searchWalkers?parentId=${parentId}&searchTerm=${searchTerm}&gender=${gender}&distance=${distance}&rating=${rating}`;

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
          router.push('/login');
          return;
        }
        // else if (response.status === 404) {
        //   setError('');
        //   return;
        // } else
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
      console.error("Search Walkers failed:", error);
      setError(error.message || 'An unknown error occurred.');
      setWalkers([]); // 如果出错，清空walker列表
    }

  };

  // 监听键盘按下事件，执行搜索
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // 当按下 Enter 键时执行搜索
    }
  };

  const handleWalkerClick = (id) => {
    router.push(`/search-parent-walker-details/${id}`);  // 跳转到 walker 详情页，并携带 walker 的 id
  };



  return (
      <BackgroundLayout>
        <div className="bg-opacity-75 p-4 rounded-lg shadow-md w-full mx-auto mb-20">

          <h1 className={`text-2xl font-semibold mb-4 lg:text-3xl ${textColor}`}>Search</h1>

          <div className="relative mb-4">
            <div className="flex items-center space-x-2 mb-2">

              <div className="relative w-full">
                {/* 输入框，输入搜索 walker 的关键字 */}
                <input
                    type="text"
                    placeholder="Search walkers.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow p-2 border rounded-lg w-full pl-10"
                />

                <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
                  />
                </svg>

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
                  className="bg-blue-500 text-white p-2 rounded-lg md:p-3 lg:p-4"
              >
                Search
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </div>


          <div className="flex justify-between mb-4">

            <div className="flex flex-col space-y-2 mb-4 md:flex-row md:flex-wrap md:space-y-0 md:space-x-4 w-full">
              <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-white border px-4 py-2 rounded-lg w-full md:w-1/4 lg:w-4/5"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>


            <div className="flex flex-col space-y-2 mb-4 md:flex-row md:flex-wrap md:space-y-0 md:space-x-4 w-full">
              <select
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="bg-white border px-4 py-2 rounded-lg w-full md:w-1/4 lg:w-4/5"
              >
                <option value="">Distance</option>
                <option value="1km">Within 1km</option>
                <option value="2km">Within 2km</option>
              </select>
            </div>


            <div className="flex flex-col space-y-2 mb-4 md:flex-row md:flex-wrap md:space-y-0 md:space-x-4 w-full">
              <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="bg-white border px-4 py-2 rounded-lg w-full md:w-1/4 lg:w-4/5"
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
                    <div key={walker.id}
                         className="border rounded-lg p-4 flex items-center space-x-4 cursor-pointer bg-white"
                         onClick={() => handleWalkerClick(walker.id)}>

                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>

                      <div>
                        <p className="font-semibold">Walker Name: {`${walker.name} ${walker.surname}`}</p>
                        <p>Gender: {walker.gender}</p>
                        <p>Address: {walker.address}</p>
                        <p>Rating: ⭐ {walker.avgUserRating} / 5</p>
                      </div>
                    </div>
                ))
            ) : (
                <p className="text-center">No walkers found</p>
            )}
          </div>

        </div>
      </BackgroundLayout>
  );
}
