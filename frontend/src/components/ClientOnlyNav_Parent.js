"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientOnlyNav_Parent() {
    const pathname = usePathname(); // Get current page path

    // List of pages without bottom navigation bar
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
    ]; // Do not show the navigation bar on these pages

    const shouldShowNav = !noNavPaths.includes(pathname); // Determine whether the current path should display a navigation bar

    if (!shouldShowNav) {
        return null; // No navigation bar
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
            <div className="flex justify-around py-2">
                <Link href="/home-parent" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/home.png" alt="Home" className="w-6 h-6 ml-1.5"/>
                        <span className="text-xs">Home</span>
                    </button>
                </Link>
                <Link href="/search-parent" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/lsearch.png" alt="Home" className="w-6 h-6 ml-1.5"/>
                        <span className="text-xs">Search</span>
                    </button>
                </Link>
                <Link href="/message-homepage-parent" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/envelope.png" alt="Home" className="w-6 h-6 ml-4"/>
                        <span className="text-xs">Messages</span>
                    </button>
                </Link>
                <Link href="/request-my-request" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/request.png" alt="Home" className="w-6 h-6 ml-2.5"/>
                        <span className="text-xs">Request</span>
                    </button>
                </Link>
                <Link href="/live-tracking-enter-parent" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/Live-tracking-1.png" alt="Home" className="w-5 h-5 ml-4 mt-1"/>
                        <span className="text-xs">Upcoming</span>
                    </button>
                </Link>
                <Link href="/profile-management-account-information" className="text-center">
                    <button className="text-center">
                        <img src="/Navigation-icons/profile.png" alt="Home" className="w-6 h-6 ml-1.5"/>
                        <span className="text-xs">Profile</span>
                    </button>
                </Link>
            </div>
        </nav>
    );
}
