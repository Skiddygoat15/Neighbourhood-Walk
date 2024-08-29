"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RateTrip() {
  const router = useRouter();
  const [rating, setRating] = useState(5); 
  const [feedback, setFeedback] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    console.log('Rating:', rating);
    console.log('Feedback:', feedback);
    
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">How was your trip?</h1>

        {/* User Information */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.28 0 4.14-1.86 4.14-4.14S14.28 3.72 12 3.72 7.86 5.58 7.86 7.86 9.72 12 12 12zm0 2.6c-2.67 0-8 1.34-8 4v1.14c0 .44.36.86.8.86h14.4c.44 0 .8-.42.8-.86v-1.14c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <p className="text-lg font-bold">Lily</p>
        </div>

        {/* Rating Section */}
        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              className={`text-3xl ${star <= rating ? 'text-black' : 'text-gray-400'}`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Feedback Section */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write a feedback (optional)"
          className="w-full p-4 border border-gray-300 rounded-lg"
          rows="4"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800"
        >
          Submit
        </button>
      </div>
    </main>
  );
}
