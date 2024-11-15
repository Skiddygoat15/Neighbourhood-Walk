"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ThankYouPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        gender: '',
        birthDate: '',
        password: '',
        confirmPassword: '',
    });
    const [roleType, setRoleType] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form validation logic can be added
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
        } else {
            // Actions after submitting the form
            router.push('/registration-loginform');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg w-96 p-8 mb-20">
                <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
                    &larr;
                </button>
                <h1 className="text-2xl font-bold text-center mb-6">Thank You for Providing Your Information!</h1>
                <p className="text-xs text-gray-600 mb-4">
                    Please return to the login page to re-login. You may choose to re-login via OAuth or use your email and password.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="text-center">
                        <button type="submit" className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800">
                            Let's Go
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ThankYouPage;
