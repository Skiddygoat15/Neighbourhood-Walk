"use client";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ReactStars from "react-rating-stars-component"; // 需要安装 react-rating-stars-component 库

export default function CommentPage() {
    const router = useRouter();
    const { id: requestId } = useParams(); // 获取 URL 中的 requestId
    const [comment, setComment] = useState('');
    const [rate, setRate] = useState(0); // 默认评分为 0
    const [walkerId, setWalkerId] = useState(null); // 保存获取到的 walkerId

    useEffect(() => {
        // 获取 walkerId
        async function fetchWalkerId() {
            try {
                const token = localStorage.getItem('token'); // 获取 token
                if (!token) {
                    console.error('No token found in localStorage');
                    return;
                }

                const response = await fetch(`http://127.0.0.1:8080/requests/getWalkerByRequestId/${requestId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch walkerId');
                }

                const data = await response.json();
                setWalkerId(data.id); // 假设返回的数据结构中 walker 的 id 为 data.id
            } catch (error) {
                console.error('Error fetching walkerId:', error);
            }
        }

        fetchWalkerId();
    }, [requestId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token'); // 获取 token
        // 创建当前时间
        const date = new Date();
        // 将时间向后移动 11 小时（11 * 60 * 60 * 1000 毫秒）
        date.setTime(date.getTime() + 11 * 60 * 60 * 1000);
        // 格式化为 YYYY-MM-DD HH:MM:SS 格式
        const commentDate = date.toISOString().replace('T', ' ').slice(0, 19);

        if (!token || !walkerId) {
            console.error('No token or walkerId found');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8080/Comment', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // 添加token到请求头
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request: {
                        requestId: parseInt(requestId) // 转换为数字格式
                    },
                    user: {
                        id: parseInt(walkerId) // 使用获取到的 walkerId
                    },
                    rate, // 评分
                    comment, // 评论
                    commentDate, // 评论时间
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            router.push('/home-parent'); // 评论提交成功后跳转
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    // 配置 ReactStars 星级选择器的选项
    const ratingChanged = (newRating) => {
        setRate(newRating);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Leave a Comment</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                <div className="mb-4">
                    <label htmlFor="rate" className="block text-lg font-medium">
                        Rating:
                    </label>
                    {/* 星级选择器 */}
                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={40}
                        isHalf={true} // 启用半颗星
                        activeColor="#ffd700"
                        value={rate}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-lg font-medium">
                        Comment:
                    </label>
                    <textarea
                        id="comment"
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className="mt-2 p-2 border rounded w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full">
                    Submit Comment
                </button>
            </form>
        </div>
    );
}
