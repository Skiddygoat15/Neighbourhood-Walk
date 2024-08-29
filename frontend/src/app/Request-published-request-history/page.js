"use client";

import { useRouter } from 'next/navigation';

export default function PublishedRequestHistory() {
  const router = useRouter();

  // 示例数据
  const historyItems = [
    { location: "Address - School", date: "21st July", duration: "15 mins" },
    { location: "Address - School", date: "16th July", duration: "12 mins" },
    { location: "Address - School", date: "26th June", duration: "13 mins" },
    { location: "Address - School", date: "26th June", duration: "" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Published request history</h1>

        {/* History Items */}
        <div className="space-y-4">
          {historyItems.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-2 flex">
              <div className="w-16 h-16 bg-gray-200"></div> {/* Placeholder for image */}
              <div className="ml-4">
                <p className="font-bold">Location: {item.location}</p>
                <p>Date: {item.date}</p>
                <p>Duration: {item.duration || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
