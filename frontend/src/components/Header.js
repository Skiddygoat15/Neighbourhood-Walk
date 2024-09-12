// components/Header.js
'use client'
import { useRouter } from 'next/navigation';


const Header = ({title, navigateTo}) => {

    const router = useRouter();

    return (
        <div className="flex items-center mb-4">
            <svg onClick={() => router.push(navigateTo)} className="h-6 w-6 cursor-pointer" fill="none"
                 stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <h1 className="text-xl font-semibold ml-2 cursor-pointer">
                {title}
            </h1>
        </div>
    );
};

export default Header;
