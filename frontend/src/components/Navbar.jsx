import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
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