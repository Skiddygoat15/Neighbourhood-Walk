"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegistrationSignup = () => {
  const [roleType, setRoleType] = useState('walker'); // Ĭ�Ͻ�ɫΪ walker
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthDate: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 每次提交前清空错误信息
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const requestData = {
      name: formData.name,
      surname: formData.surname,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      password: formData.password,
      gender: formData.gender,
      birthDate: new Date(formData.birthDate).toISOString(),
    };

    const apiUrl = `http://localhost:8080/Users/register?roleType=${roleType}`;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        const errorMessage = await res.text(); // 捕获后端返回的错误消息
        setError(errorMessage || 'Registration failed'); // 直接设置错误信息
        return; // 直接返回，防止继续执行后续逻辑
      }

      router.push('/registration-loginform');
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg w-96 p-8">
          {/* Back Button */}
          <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
            &larr;
          </button>
          <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">First name</label>
              <input id="name" type="text" value={formData.name} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div className="mb-4">
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Last name</label>
              <input id="surname" type="text" value={formData.surname} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
              <div className="flex">
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" type="email" value={formData.email} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
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
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Date of birth</label>
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
              <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            {/* Sign Up button */}
            <div className="text-center">
              <button type="submit"
                      className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800">Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default RegistrationSignup;
