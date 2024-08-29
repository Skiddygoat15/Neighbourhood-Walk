"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [role, setRole] = useState('Walker');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (role === 'Walker') {
      router.push('/Registration-verification-walker');
    } else if (role === 'Parent') {
      router.push('/Registration-verification-parent');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-xs space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>

        {/* Role Selection */}
        <div className="flex justify-center space-x-4">
          <label>
            <input 
              type="radio" 
              name="role" 
              value="Walker" 
              checked={role === 'Walker'} 
              onChange={() => setRole('Walker')} 
            />
            Walker
          </label>
          <label>
            <input 
              type="radio" 
              name="role" 
              value="Parent" 
              checked={role === 'Parent'} 
              onChange={() => setRole('Parent')} 
            />
            Parent
          </label>
        </div>

        {/* Sign Up Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input 
              type="text" 
              placeholder="First name" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
              required 
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Last name" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
              required 
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Phone number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
              required 
            />
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
              required 
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Address" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="block w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800">
            Sign Up
          </button>
        </form>
      </div>
    </main>
  );
}
