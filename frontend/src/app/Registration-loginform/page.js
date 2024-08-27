"use client";

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>User Registration - Login</title>
        <meta name="description" content="User registration and login page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-xs space-y-8">
          {/* Back Button */}
          <Link 
            href={'/Registration-login'}
            className="text-2xl p-2 focus:outline-none">
            &larr;
          </Link>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center">Login</h1>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Phone number or Email" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button 
              type="submit" 
              className="block w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800">
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-2">
            <hr className="w-1/3 border-gray-300" />
            <span className="text-gray-500">or</span>
            <hr className="w-1/3 border-gray-300" />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            <button className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-full font-semibold text-black hover:bg-gray-100">
              <img src="/google-icon.png" alt="Google" className="w-6 h-6 mr-2" />
              Login with Google
            </button>
            <button className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-full font-semibold text-black hover:bg-gray-100">
              <img src="/apple-icon.png" alt="Apple" className="w-6 h-6 mr-2" />
              Login with Apple
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

