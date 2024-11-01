"use client"
import React, { useState } from 'react';

const IdentityVerificationForm = () => {
    const [document, setDocument] = useState('');
    const [face, setFace] = useState('');
    const [profileId, setProfileId] = useState('YOUR_PROFILE_ID');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleFileChange = (file, setFile) => {
        const reader = new FileReader();
        reader.onloadend = () => setFile(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${apiUrl}/api/identity/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ document, face, profileId }),
        });

        const result = await response.json();
        console.log(result); // 可以在前端处理结果
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Document Image:
                <input type="file" onChange={(e) => handleFileChange(e.target.files[0], setDocument)} />
            </label>
            <br />
            <label>
                Face Image:
                <input type="file" onChange={(e) => handleFileChange(e.target.files[0], setFace)} />
            </label>
            <br />
            <button type="submit">Verify Identity</button>
        </form>
    );
};

export default IdentityVerificationForm;
