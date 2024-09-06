// pages/Registration-signup.js
import React from 'react';

const RegistrationSignup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-96 p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        {/* Walker or Parent selection */}
        <div className="flex justify-center mb-6">
          <label className="inline-flex items-center mr-6">
            <input type="radio" className="form-radio h-4 w-4 text-blue-600" name="role" value="Walker" defaultChecked />
            <span className="ml-2">Walker</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" className="form-radio h-4 w-4 text-blue-600" name="role" value="Parent" />
            <span className="ml-2">Parent</span>
          </label>
        </div>

        {/* Form fields */}
        <form>
          <div className="mb-4">
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
            <input id="first-name" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          
          <div className="mb-4">
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
            <input id="last-name" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
            <input id="phone" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input id="address" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* Gender selection with Female, Male, Other */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select id="gender" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of birth</label>
            <input id="dob" type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* Sign Up button */}
          <div className="text-center">
            <button type="submit" className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationSignup;
