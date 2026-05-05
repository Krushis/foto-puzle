import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { auth } from "../utils/auth";

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn());
    const [isAdmin, setIsAdmin] = useState(auth.isAdmin());

    useEffect(() => {
        const syncAuthState = () => {
            const loggedIn = auth.isLoggedIn();
            setIsLoggedIn(loggedIn);
            setIsAdmin(auth.isAdmin());

            const protectedPaths = ["/profile", "/orders", "/admin"];
            const currentPath = window.location.pathname;

            if (!loggedIn && protectedPaths.includes(currentPath)) {
                navigate("/login");
                return;
            }

            if (currentPath === "/admin" && !auth.isAdmin()) {
                navigate("/");
            }
        };

        window.addEventListener("authChanged", syncAuthState);
        const intervalId = window.setInterval(syncAuthState, 1000);

        return () => {
            window.removeEventListener("authChanged", syncAuthState);
            window.clearInterval(intervalId);
        };
    }, [navigate]);

    const handleLogout = () => {
        auth.removeToken();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    Foto-Puzlė
                </Link>
            </div>

            <div className="navbar-right">
                <Link to="/" className="navbar-link">
                    Pagrindinis
                </Link>

                <Link to="/checkout" className="navbar-link">
                    Dėlionė
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link to="/profile" className="navbar-link">
                            Profilis
                        </Link>
                        {isAdmin && (
                            <Link to="/admin" className="navbar-link">
                                Admin
                            </Link>
                        )}
                        <button className="navbar-logout" onClick={handleLogout}>
                            Atsijungti
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-link">
                            Prisijungti
                        </Link>
                        <Link to="/register" className="navbar-link">
                            Registruotis
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
