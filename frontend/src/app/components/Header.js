// components/Header.js
"use client";
import { useRouter } from 'next/navigation';

const Header = ({title, onBack,textColor}) => {

    const router = useRouter();

    const goBack = () => {
        if (onBack) {
            onBack();  // 如果提供了 onBack 函数，使用它
        } else {
            router.back();  // 否则使用 useRouter 的 back 方法返回上一页
        }
    };
    return (
        <div className="flex items-center mb-4">
            <svg onClick={goBack} className={`h-6 w-6 ${textColor} cursor-pointer`} fill="none"
                 stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <h1 className={`text-xl ${textColor} font-semibold ml-2 cursor-pointer`}>
                {title}
            </h1>
        </div>
    );
};

export default Header;
