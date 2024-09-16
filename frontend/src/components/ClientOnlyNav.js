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
};
export default ClientOnlyNav;

