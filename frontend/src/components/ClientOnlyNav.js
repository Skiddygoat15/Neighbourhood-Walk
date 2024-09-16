"use client"; // 确保这是一个客户端组件

import { useEffect, useState } from "react";
import ClientOnlyNav_Parents from "../components/ClientOnlyNav_Parent";
import ClientOnlyNav_Walker from "../components/ClientOnlyNav_Walker";
import Link from "next/link"; // 假设你有一个针对 Walker 的导航栏组件

const ClientOnlyNav = () => {
    const [currentRole, setCurrentRole] = useState(null);

    useEffect(() => {
        // 从 localStorage 获取 currentRole
        const role = localStorage.getItem("currentRole");
        setCurrentRole(role);
    }, []);

    // 根据 currentRole 渲染不同的导航栏
    if (currentRole === "parent") {
        return <ClientOnlyNav_Parents />;
    } else if (currentRole === "walker") {
        return <ClientOnlyNav_Walker />;
    } else {
        return null; // 如果没有角色，或者角色还未加载完成，可以不显示任何东西，或者显示一个默认的内容
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
                <Link href="/notification-homepage" className="text-center">
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
};
export default ClientOnlyNav;

