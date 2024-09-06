// src/app/Admin/page.js
"use client"; 

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
  
      <h1 className="text-4xl font-bold mb-8">Admin</h1>


      <div className="space-y-4 w-full max-w-xs">
        <button className="w-full border-2 border-black py-4 text-lg rounded-lg">
          User management
        </button>
        <button className="w-full border-2 border-black py-4 text-lg rounded-lg">
          Content Management
        </button>
        <button className="w-full border-2 border-black py-4 text-lg rounded-lg">
          System monitoring
        </button>
        <button className="w-full border-2 border-black py-4 text-lg rounded-lg">
          Data analysis reports
        </button>
      </div>
    </div>
  );
}
