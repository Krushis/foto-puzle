import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";

function MainPage() {
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userName = user?.name || "";

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="main-container">
            <h1>Foto-Puzlė</h1>

            <p>
                Užsisakykite savo unikalią dėlionę iš bet kurios nuotraukos!
                Tai puiki dovana arba linksmas projektas šeimai ir draugams.
            </p>

            {isLoggedIn && <p className="welcome-text">Sveiki, {userName}!</p>}

            <div className="button-group">
                {!isLoggedIn ? (
                    <>
                        <button
                            className="register-button"
                            onClick={() => navigate("/register")}
                        >
                            Registruotis
                        </button>

                        <button
                            className="login-button"
                            onClick={() => navigate("/login")}
                        >
                            Prisijungti
                        </button>
                    </>
                ) : (
                    <button className="logout-button" onClick={handleLogout}>
                        Atsijungti
                    </button>
                )}
            </div>
        </div>
    );
}

export default MainPage;