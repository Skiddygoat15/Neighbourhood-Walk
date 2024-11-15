import dynamic from 'next/dynamic';
import React from 'react';

// Dynamic import, disable server-side rendering
const NoSSRWrapper = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), {
    ssr: false,
});

export default NoSSRWrapper;