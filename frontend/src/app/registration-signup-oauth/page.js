"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { geocodeAddress } from '@/components/geocode';


const RegistrationSignup = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log('Component RegistrationSignup is rendering');
    const router = useRouter();

    // 直接获取 URL 参数
    let userId = '';
    let name = '';
    let surname = '';

    if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        userId = searchParams.get('userId') || '';
        name = searchParams.get('name') || '';
        surname = searchParams.get('surname') || '';
        console.log('URL Params:', { userId, name, surname });
    }

    const [roleType, setRoleType] = useState('walker'); // 默认角色为 walker
    const [formData, setFormData] = useState({
        userId: userId,
        name: name,
        surname: surname,
        phone: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: '',
        gender: '',
        birthDate: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const { lat, lng, formatted_address } = await geocodeAddress(formData.address); // 地址转换为经纬度

            const requestData = {
                userId: formData.userId,
                phone: formData.phone,
                address: formatted_address,
                latitude: lat,
                longitude: lng,
                password: formData.password,
                gender: formData.gender,
                birthDate: new Date(formData.birthDate).toISOString(),
            };

            const postUrl = `http://${apiUrl}/Users/registerOA?roleType=${roleType}&userId=${formData.userId}`;

            const res = await fetch(postUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': '',
                },
                body: JSON.stringify(requestData),
            });

            if (!res.ok) {
                const errorMessage = await res.text();
                setError(errorMessage || 'Registration failed');
                return;
            }

            router.push('/registration-loginform');
        } catch (err) {
            setError(err.message || 'Registration failed');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg w-96 p-8 mb-20">
                {/* Back Button */}
                <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
                    &larr;
                </button>
                <h1 className="text-2xl font-bold text-center mb-6">Just one more step!</h1>
                <p className={`text-xs text-gray-600 mb-4`}>Thank you for providing your Google account. Now, we kindly need a bit more information to serve you better
                </p>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <div className="flex justify-center mb-6">
                    <label className="inline-flex items-center mr-6">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-blue-600"
                            name="role"
                            value="walker"
                            checked={roleType === 'walker'}
                            onChange={() => setRoleType('walker')}
                        />
                        <span className="ml-2">Walker</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-blue-600"
                            name="role"
                            value="parent"
                            onChange={() => setRoleType('parent')}
                        />
                        <span className="ml-2">Parent</span>
                    </label>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
                        <div className="flex">
              <span
                  className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                +61
              </span>
                            <input
                                id="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="block w-full h-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input id="address" type="text" value={formData.address} onChange={handleChange}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>

                    {/* Gender selection */}
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select id="gender" value={formData.gender} onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Gender</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Date of
                            birth</label>
                        <input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" type="password" value={formData.password} onChange={handleChange}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm
                            Password</label>
                        <input id="confirmPassword" type="password" value={formData.confirmPassword}
                               onChange={handleChange}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>

                    {/* Sign Up button */}
                    <div className="text-center">
                        <button type="submit"
                                className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800">Sign
                            Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationSignup;
