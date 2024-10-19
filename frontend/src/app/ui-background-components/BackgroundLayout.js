"use client"
// src/ui-background-components/BackgroundLayout.js

import React, { useState, useEffect } from 'react';
import BackgroundEffect from './backgroundEffect';

export default function BackgroundLayout({ children }) {
    const [backgroundTheme, setBackgroundTheme] = useState('morning');

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 6 && currentHour < 12) {
            setBackgroundTheme('morning');
        } else if (currentHour >= 12 && currentHour < 17) {
            setBackgroundTheme('afternoon');
        } else if (currentHour >= 17 && currentHour < 24) {
            setBackgroundTheme('midnight');
        } else {
            setBackgroundTheme('evening');
        }
    }, []);

    return (
        <div className="w-full min-h-screen h-screen flex flex-col items-center overflow-hidden">
            {/* Background Layer */}
            <div className={`absolute top-0 left-0 w-full h-full -z-10 ${
                backgroundTheme === 'morning' ? 'bg-morning' :
                    backgroundTheme === 'afternoon' ? 'bg-afternoon' :
                        backgroundTheme === 'evening' ? 'bg-evening' : 'bg-midnight'
            }`}>
                <BackgroundEffect backgroundTheme={backgroundTheme} />
            </div>

            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
