"use client";

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import {useEffect, useState} from "react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = { email, password };

        try {
            const res = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            if (!res.ok) {
                throw new Error('Login failed');
            }
            const data = await res.json();
            const token = data.token;  // Assuming token is returned as 'token'
            localStorage.setItem('token', token);
            localStorage.setItem('userId', data.userId);
            console.log("current userId: ", data.userId);
            router.push('/home-parent');  // Redirect after successful login
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login Page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
                <h1 className="text-4xl font-bold mb-10">Login to MyApp</h1>

                <form onSubmit={handleLogin} className="w-80 space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full p-3 text-black rounded-md"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full p-3 text-black rounded-md"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" className="w-full py-3 bg-white text-black rounded-md font-semibold hover:bg-gray-200">
                        Login
                    </button>
                </form>

                <p className="mt-6">
                    Don't have an account?{' '}
                    <a href="/register" className="text-white underline">
                        Sign up here
                    </a>
                </p>
            </main>
        </>
    );
}
