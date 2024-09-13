"use client"; // 这个组件是客户端组件

import Link from "next/link";
import { usePathname } from "next/navigation"; // 只能在客户端组件中使用

export default function ClientOnlyNav() {
    const pathname = usePathname(); // 获取当前页面路径

    // 不显示底部导航栏的页面列表
    const noNavPaths = [
        "/registration-login-coverpage",
        "/registration-loginform",
        "/registration-signup",
        "/registration-verification-parent",
        "/registration-verification-parent-successful",
        "/registration-verification-parent-upload",
        "/registration-verification-parent-waiting",
        "/registration-verification-walker",
        "/registration-verification-walker-successful",
        "/registration-verification-walker-upload",
        "/registration-verification-walker-waiting",
    ]; // 在这些页面不显示导航栏

    const shouldShowNav = !noNavPaths.includes(pathname); // 判断当前路径是否应显示导航栏

    if (!shouldShowNav) {
        return null; // 不显示导航栏
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
            <div className="flex justify-around py-2">
                <Link href="/home-parent" className="text-center">
                    <button className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18V3H3z" />
                        </svg>
                        <span className="text-xs">Home</span>
                    </button>
                </Link>
                <Link href="/search-parent" className="text-center">
                    <button className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                        </svg>
                        <span className="text-xs">Search</span>
                    </button>
                </Link>
                <Link href="/messages" className="text-center">
                    <button className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H7v10h14V10z" />
                        </svg>
                        <span className="text-xs">Messages</span>
                    </button>
                </Link>
                <Link href="/request-my-request" className="text-center">
                    <button className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h18M3 16h18" />
                        </svg>
                        <span className="text-xs">Request</span>
                    </button>
                </Link>
                <Link href="/home-parent" className="text-center">
                    <button className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14l-4-4-4 4" />
                        </svg>
                        <span className="text-xs">Profile</span>
                    </button>
                </Link>
            </div>
        </nav>
    );
}
