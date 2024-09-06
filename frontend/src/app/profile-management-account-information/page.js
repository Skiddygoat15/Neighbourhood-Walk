"use client";

import { useRouter } from 'next/navigation';

export default function ProfileManagementAccountInformation() {
  const router = useRouter();

  const handleEdit = (path) => {
    if (path !== '/edit/date-of-birth' && path !== '/edit/address') {
      router.push('/profile-attributes-modification');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Account Information</h1>

        {/* User Info Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">User Name</h2>
          </div>
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <span>Image</span>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b py-2">
            <span>Preferred Name</span>
            <div className="flex items-center">
              <span>xxxx</span>
              <button onClick={() => handleEdit('/edit/preferred-name')} className="ml-2 text-gray-500">
                &gt;
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>Date of Birth</span>
            <div className="flex items-center">
              <span>xx/xx/xxxx</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>Phone Number</span>
            <div className="flex items-center">
              <span>+61 xxxxxx</span>
              <button onClick={() => handleEdit('/edit/phone-number')} className="ml-2 text-gray-500">
                &gt;
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>E-mail Address</span>
            <div className="flex items-center">
              <span>xxxxxx</span>
              <button onClick={() => handleEdit('/edit/email-address')} className="ml-2 text-gray-500">
                &gt;
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>Address</span>
            <div className="flex items-center">
              <span>xxxxxxxx</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>Communication Preference</span>
            <div className="flex items-center">
              <span>xxxxxxxx</span>
              <button onClick={() => handleEdit('/edit/communication-preference')} className="ml-2 text-gray-500">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
