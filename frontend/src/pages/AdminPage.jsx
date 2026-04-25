import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/auth";

function AdminPage() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAdmin()) {
            navigate("/");
        }
    }, [navigate]);

    if (!auth.isAdmin()) return null;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Admin Panel</h1>
            <p>Welcome, admin. Role-based access is working correctly.</p>
        </div>
    );
}

export default AdminPage;
