// components/Header.js
"use client";
import { useRouter } from 'next/navigation';

const Header = ({title, onBack,textColor}) => {

    const router = useRouter();

    const goBack = () => {
        if (onBack) {
            onBack();  // If the onBack function is provided, use it!
        } else {
            router.back();  // Otherwise, use the back method of useRouter to return to the previous page.
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
