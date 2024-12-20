"use client"
import React, { useEffect, useState } from 'react';

export default function BackgroundEffect({ backgroundTheme }) {
    const numStars = 70;
    const stars = Array.from({ length: numStars }).map((_, index) => (
        <div
            key={index}
            className="star"
            style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                animationDelay: `${Math.random() * 3}s`
            }}
        />
    ));
    const shootingStars = Array.from({ length: 20 }).map((_, index) => (
        <div
            key={index}
            className="shooting-star"
            style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
            }}
        />
    ));

    const clouds = Array.from({ length: 5 }).map((_, index) => (
        <div
            key={index}
            className="cloud"
            style={{
                top: `${Math.random() * 10}%`,
                left: `${Math.random() * 100}vw`,
                animationDuration: `${20 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 10}s`
            }}
        >
            <div className="cloud-part" style={{ width: '60px', height: '60px', top: '10px', left: '10px' }} />
            <div className="cloud-part" style={{ width: '90px', height: '90px', top: '0', left: '40px' }} />
            <div className="cloud-part" style={{ width: '70px', height: '70px', top: '20px', left: '80px' }} />
            <div className="cloud-part" style={{ width: '50px', height: '50px', top: '40px', left: '30px' }} />
            <div className="cloud-part" style={{ width: '60px', height: '60px', top: '30px', left: '70px' }} />
        </div>
    ));


    return (
        <div className={`min-h-screen w-full ${
            backgroundTheme === 'morning' ? 'bg-morning' :
                backgroundTheme === 'afternoon' ? 'bg-afternoon' :
                    backgroundTheme === 'evening' ? 'bg-evening' : 'bg-midnight'
        }`}>
            {(backgroundTheme === 'midnight' || backgroundTheme === 'evening') && shootingStars}
            {(backgroundTheme === 'morning' || backgroundTheme === 'afternoon') && clouds}
            {(backgroundTheme === 'midnight' || backgroundTheme === 'evening') && stars}
            {backgroundTheme === 'midnight' && (
                <>
                    <div className="coastline"></div>
                    <div className="moonlit-scene">
                        <img src="/Princess and rose.png" alt="Princess and Rose at the Bottom"/>
                    </div>
                </>
            )}
            {backgroundTheme === 'evening' &&
                <div className="moonlit-scene">
                    <img src="/Princess and rose.png" alt="Princess and Rose at the Bottom"/>

                <div className="moon">

                </div>
                </div>
            }
            {backgroundTheme === 'afternoon' && (
                <div className="sun"></div>
            )}
        </div>
    );
}
