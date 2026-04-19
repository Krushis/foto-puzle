import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";
import { auth } from "../utils/auth";

function MainPage() {
    const navigate = useNavigate();
    const isLoggedIn = auth.isLoggedIn();
    const user = auth.getUser();
    const userName = user?.username || "Vartotojas";

    return (
        <div className="main-container">
            <div className="hero-card">
                <h1>Foto-Puzlė</h1>
                <p className="main-description">
                    Paverskite savo mėgstamą nuotrauką unikalia dėlione.
                    Sukurkite smagią ir įsimintiną dovaną sau, draugams ar šeimai.
                </p>

                <p className="access-text">
                    Šis puslapis prieinamas tiek svečiams, tiek prisijungusiems vartotojams.
                </p>

                {isLoggedIn ? (
                    <p className="welcome-text">Sveiki sugrįžę, {userName}!</p>
                ) : (
                    <p className="welcome-text">Sveiki, svečias!</p>
                )}

                <div className="button-group">
                    <button
                        className="primary-action-button"
                        onClick={() => navigate("/checkout")}
                    >
                        Pradėti kurti dėlionę
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MainPage;