"use client";

import { useEffect, useState } from "react";
import ClientOnlyNav_Parents from "../components/ClientOnlyNav_Parent";
import ClientOnlyNav_Walker from "../components/ClientOnlyNav_Walker";
import Link from "next/link";

const ClientOnlyNav = () => {
    const [currentRole, setCurrentRole] = useState(null);

    useEffect(() => {

        const role = sessionStorage.getItem("currentRole");
        setCurrentRole(role);
    }, []);

    // Render different navigation bars based on currentRole
    if (currentRole === "parent") {
        return <ClientOnlyNav_Parents />;
    } else if (currentRole === "walker") {
        return <ClientOnlyNav_Walker />;
    } else {
        return null;
        // If there is no character, or if the character has not finished loading, you can either not show anything, or show a default content
    }
};
export default ClientOnlyNav;

