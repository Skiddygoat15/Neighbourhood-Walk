"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function PreMeetParent() {
  const router = useRouter();
  const [meetingType, setMeetingType] = useState("online");
  const [contactMethod, setContactMethod] = useState("phone");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingInfo, setMeetingInfo] = useState("");
  const textColor = useTextColor();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let parentId = null;
  let walkerId = null;
  let requestId = null;
  let token = null;
  if (typeof window !== 'undefined' && window.sessionStorage) {
    let preMeetIds = sessionStorage.getItem("preMeetIds").split(',');
    parentId = preMeetIds[0];
    walkerId = preMeetIds[1];
    requestId = preMeetIds[2];
    token = sessionStorage.getItem('token');
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

    if (!meetingInfo || meetingInfo.trim() === '') {
      alert('Meeting Link and Address is required. Please try again.');
      return;
    }

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
      time: new Date(meetingDate),
      preMeetType: meetingType,
      contactApproach: contactMethod,
      urlOrAddress: meetingInfo,
      newOrNot: true
    }
    const createPreMeetAPI = `${apiUrl}/preMeet/create/${parentId}/${walkerId}/${requestId}`
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
          router.push('/pre-meet-parent-info');
          //setLoading(false);
        })
        .catch(err => {
          console.log(err);
          alert('Failed to create preMeet. Please try again.');
          //setLoading(false);
        });
  };

  return (
      <BackgroundLayout>
        <main className="min-h-screen">

          <button onClick={() => router.back()} className={`text-2xl p-2 focus:outline-none ${textColor}`}>
            &larr;
          </button>


          <h1 className={`text-3xl font-bold text-center ${textColor}`}>Pre-meet Form</h1>


          <p className={`text-center text-sm ${textColor}`}>
            Please fill in the details to invite the walker for a pre-meet
          </p>


          <div className="max-w-md mx-auto p-4 bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">

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


              <button
                  type="submit"
                  className="w-full py-4 text-center bg-black text-white rounded-lg text-xl"
              >
                Submit
              </button>
            </form>
            </div>
        </main>
      </BackgroundLayout>
);
}
