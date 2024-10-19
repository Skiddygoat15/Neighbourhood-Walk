import dynamic from 'next/dynamic';
import React from 'react';

// 动态导入，禁用服务端渲染
const NoSSRWrapper = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), {
    ssr: false,
});

export default NoSSRWrapper;