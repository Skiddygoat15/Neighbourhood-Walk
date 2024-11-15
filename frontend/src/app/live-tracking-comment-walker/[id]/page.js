"use client";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ReactStars from "react-rating-stars-component"; // need to install react-rating-stars-component repository
import BackgroundLayout from '../../ui-background-components/BackgroundLayout';
import useTextColor from '../../ui-background-components/useTextColor';

export default function CommentPage() {
    const textColor = useTextColor();
    const router = useRouter();
    const { id: requestId } = useParams(); // Get the requestId in the URL
    const [comment, setComment] = useState('');
    const [rate, setRate] = useState(0); // Default rating is 0
    const [parentId, setParentId] = useState(null); // Stores the obtained parentId
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        // get parentId
        async function fetchParentId() {
            try {
                const token = sessionStorage.getItem('token'); // get token
                if (!token) {
                    console.error('No token found in sessionStorage');
                    return;
                }

                const response = await fetch(`${apiUrl}/requests/getParentByRequestId/${requestId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch parentId');
                }

                const data = await response.json();
                // console.info("parent is: ",data.id);
                console.info("request is: ",requestId);
                setParentId(data.id); // Assume that the id of parentId in the returned data structure is data.id.
            } catch (error) {
                console.error('Error fetching parentId:', error);
            }
        }

        fetchParentId();
    }, [requestId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = sessionStorage.getItem('token'); // get token
        // Create current time
        const date = new Date();
        // Move time back 11 hours (11 * 60 * 60 * 1000 milliseconds)
        date.setTime(date.getTime() + 11 * 60 * 60 * 1000);
        // Formatted as YYYY-MM-DD HH:MM:SS format
        const commentDate = date.toISOString().replace('T', ' ').slice(0, 19);

        if (!token || !parentId) {
            console.error('No token or parentId found');
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/Comment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to request header
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request: {
                        requestId: parseInt(requestId) // convert to digital format
                    },
                    user: {
                        id: parseInt(parentId) // Use the obtained parentId
                    },
                    rate,
                    comment,
                    commentDate,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            router.push('/home-walker'); // Jump after successful comment submission
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    // Configuring options for the ReactStars star selector
    const ratingChanged = (newRating) => {
        setRate(newRating);
    };

    return (
        <BackgroundLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className={`text-3xl font-bold mb-6 ${textColor}`}>Leave a Comment</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                <div className="mb-4">
                    <label htmlFor="rate" className="block text-lg font-medium">
                        Rating:
                    </label>

                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={40}
                        isHalf={true}
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
            </BackgroundLayout>
    );
}
