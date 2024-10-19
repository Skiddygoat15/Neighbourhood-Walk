"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PreMeetParent() {
  const router = useRouter();
  const [meetingType, setMeetingType] = useState("online");
  const [contactMethod, setContactMethod] = useState("phone");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingInfo, setMeetingInfo] = useState("");
  let parentId = null;
  let walkerId = null;
  let requestId = null;
  let token = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    parentId = localStorage.getItem("preMeetIds")[0];
    walkerId = localStorage.getItem("preMeetIds")[2];
    requestId = localStorage.getItem("preMeetIds")[4];
    token = localStorage.getItem('token');
  }

  const data = {
    "time": "2024-10-01T14:00:00",
    "preMeetType": "Online",
    "contactApproach": "Email",
    "urlOrAddress": "https://example.com/meeting-link",
    "newOrNot": true
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以加入数据提交的逻辑，比如调用API保存数据
    console.log({
      meetingType,
      contactMethod,
      meetingDate,
      meetingInfo,
      parentId,
      walkerId,
      requestId
    });
    const finalSendBody = {
      time: meetingDate,
      preMeetType: meetingType,
      contactApproach: contactMethod,
      urlOrAddress: meetingInfo,
      newOrNot: true
    }
    const createPreMeetAPI = `http://127.0.0.1:8080/preMeet/create/${parentId}/${walkerId}/${requestId}`
    fetch(createPreMeetAPI, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(finalSendBody)
    })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              //setError(text);
              alert(text);
              throw new Error(text || "Error accepting walker");
            });
          }
          alert('create preMeet successfully.');
          router.push('/pre-meet-parent-info'); // 修改成你想跳转的页面
          //setLoading(false);
        })
        .catch(err => {
          console.log(err);
          alert('Failed to create preMeet. Please try again.');
          //setLoading(false);
        });
    // 表单提交后跳转到其他页面
  };

  return (
      <main className="min-h-screen bg-white">
        <div className="max-w-md mx-auto p-4 space-y-8">
          {/* Back Button */}
          <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
            &larr;
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center">Pre-meet Form</h1>

          {/* Subtitle */}
          <p className="text-center text-sm text-gray-600">
            Please fill in the details to invite the walker for a pre-meet
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Meeting Type */}
            <div>
              <label htmlFor="meetingType" className="block text-lg font-medium">
                Meeting Type
              </label>
              <select
                  id="meetingType"
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="online">Online</option>
                <option value="offline">Face-to-Face</option>
              </select>
            </div>

            {/* Contact Method */}
            <div>
              <label htmlFor="contactMethod" className="block text-lg font-medium">
                Contact Method
              </label>
              <p className="text-left text-sm text-gray-600">
                By providing contact method, your contact information will be sent to the walker you just accepted.
              </p>
              <select
                  id="contactMethod"
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Phone">Phone</option>
                <option value="Email">Email</option>
              </select>
            </div>

            {/* Meeting Date and Time */}
            <div>
              <label htmlFor="meetingDate" className="block text-lg font-medium">
                Meeting Date and Time
              </label>
              <input
                  type="datetime-local"
                  id="meetingDate"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Meeting Info */}
            <div>
              <label htmlFor="meetingInfo" className="block text-lg font-medium">
                Meeting Link or Address
              </label>
              <input
                  type="text"
                  id="meetingInfo"
                  placeholder="Enter the meeting link or address"
                  value={meetingInfo}
                  onChange={(e) => setMeetingInfo(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-4 text-center bg-black text-white rounded-lg text-xl"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
  );
}
