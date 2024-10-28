"use client"; // 这个组件是客户端组件

import Link from "next/link";
import { usePathname } from "next/navigation"; // 只能在客户端组件中使用

export default function ClientOnlyNav_Parent() {
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
        "/registration-login-identity-select"
    ]; // 在这些页面不显示导航栏

    const shouldShowNav = !noNavPaths.includes(pathname); // 判断当前路径是否应显示导航栏

    if (!shouldShowNav) {
        return null; // 不显示导航栏
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
            <div className="flex justify-around py-2">
                <Link href="/home-walker" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/home.png" alt="Home" className="w-6 h-6 ml-1.5"/>
                        <span className="text-xs">Home</span>
                    </button>
                </Link>
                <Link href="/search-walker" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/lsearch.png" alt="Home" className="w-6 h-6 ml-1.5"/>
                        <span className="text-xs">Search</span>
                    </button>
                </Link>
                <Link href="/message-homepage-walker" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/envelope.png" alt="Home" className="w-6 h-6 ml-4"/>
                        <span className="text-xs">Messages</span>
                    </button>
                </Link>
                <Link href="/request-status-walker" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/request.png" alt="Home" className="w-6 h-6 ml-2.5"/>
                        <span className="text-xs">Request</span>
                    </button>
                </Link>
                <Link href="/live-tracking-enter-walker" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/Live-tracking-1.png" alt="Home" className="w-5 h-5 ml-4 mt-1"/>
                        <span className="text-xs">Upcoming</span>
                    </button>
                </Link>
                <Link href="/profile-management-account-information-walker" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/profile.png" alt="Home" className="w-6 h-6 ml-1.5"/>
                        <span className="text-xs">Profile</span>
                    </button>
                </Link>
            </div>
        </nav>
    );
}
