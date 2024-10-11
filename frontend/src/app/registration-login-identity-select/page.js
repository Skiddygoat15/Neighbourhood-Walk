"use client"; // This marks the component as a client component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Updated import for routing

const LoginIdentitySelect = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter(); // using the updated navigation router

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleContinue = () => {
    if (selectedRole === "walker") {
      router.push("/home-walker"); // replace with actual route for walker
    } else if (selectedRole === "parent") {
      router.push("/home-parent"); // replace with actual route for parent
    } else {
      alert("Please select a role to continue.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-start items-center px-4 py-10">
      {/* Back button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.back()}
          className="text-black flex items-center hover:underline text-lg"
        >
          <svg
            className="h-6 w-6 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back
        </button>
      </div>

      {/* Main container */}
      <div className="w-full max-w-lg mx-auto p-8 shadow-md rounded-md bg-gray-50 mt-10">
        <h1 className="text-3xl font-semibold mb-6 text-center">Login - Identity Select</h1>
        <p className="text-gray-700 text-xl mb-8 text-center">
          Based on your personal information, the system detected two identities.
          Please select one to log in.
        </p>

        <div className="flex justify-center items-center space-x-12 mb-6">
          <label className="flex items-center text-xl">
            <input
              type="radio"
              name="role"
              value="walker"
              checked={selectedRole === "walker"}
              onChange={handleRoleChange}
              className="form-radio h-6 w-6 text-black"
            />
            <span className="ml-3">Walker</span>
          </label>

          <label className="flex items-center text-xl">
            <input
              type="radio"
              name="role"
              value="parent"
              checked={selectedRole === "parent"}
              onChange={handleRoleChange}
              className="form-radio h-6 w-6 text-black"
            />
            <span className="ml-3">Parent</span>
          </label>
        </div>

        <p className="text-red-500 text-lg mb-6 text-center">
          Note: Different identities will have different interfaces and functions.
        </p>

        <button
          onClick={handleContinue}
          className="w-full bg-black text-white py-4 rounded-lg text-xl font-semibold hover:bg-gray-800 transition duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginIdentitySelect;
