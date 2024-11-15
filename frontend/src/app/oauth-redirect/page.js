"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const OAuthRedirect = () => {
    // Get user information from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const name = urlParams.get('name');
    const preferredName = urlParams.get('preferredName');
    const roles = urlParams.get('roles') ? urlParams.get('roles').split(',') : [];
    const token = urlParams.get('token');

    // Check that user information is complete
    if (userId && name && token) {
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('roles', JSON.stringify(roles));
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('preferredName', preferredName);

        // Redirect to the appropriate page based on user role
        if (roles.length === 1) {
            if (roles[0] === 'parent') {
                sessionStorage.setItem('currentRole', 'parent');
                window.location.href = '/home-parent';
            } else if (roles[0] === 'walker') {
                sessionStorage.setItem('currentRole', 'walker');
                window.location.href = '/home-walker';
            }
        } else if (roles.length > 1) {
            window.location.href = '/registration-login-identity-select';
        }
    } else {
        console.error("The URL parameter was missing and the redirection could not be handled correctly.");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="loader mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Redirecting...</p>

            <style jsx>{`
                .loader {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border-left-color: #4f46e5;
                    animation: spin 1s ease infinite;
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default OAuthRedirect;

