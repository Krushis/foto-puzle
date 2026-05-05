import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";
import { auth } from "../utils/auth";
import { apiFetch } from "../utils/api";

const API_BASE_URL = "http://localhost:5192";

function MainPage() {
    const navigate = useNavigate();
    const isLoggedIn = auth.isLoggedIn();
    const user = auth.getUser();
    const userName = user?.username || "Vartotojas";

    const [publicPuzzles, setPublicPuzzles] = useState([]);
    const [zoomedPuzzle, setZoomedPuzzle] = useState(null);

    useEffect(() => {
        apiFetch("/api/puzzle/public")
            .then(async (res) => {
                if (!res.ok) throw new Error("Nepavyko įkelti galerijos");
                return await res.json();
            })
            .then((data) => setPublicPuzzles(data))
            .catch((err) => console.error(err));
    }, []);

    const getImageUrl = (filePath) => {
        if (!filePath) return "";
        if (filePath.startsWith("http")) return filePath;
        return `${API_BASE_URL}${filePath}`;
    };

    const handlePuzzleClick = (puzzleId) => {
        if (!auth.isLoggedIn()) {
            alert("Norėdami užsisakyti dėlionę, pirmiausia prisijunkite.");
            navigate("/login");
            return;
        }

        navigate(`/puzzle/${puzzleId}`);
    };

    return (
        <div className="main-container">
            <div className="hero-card">
                <h1>Foto-Puzlė</h1>

                <p className="main-description">
                    Paverskite savo mėgstamą nuotrauką unikalia dėlione.
                    Sukurkite smagią ir įsimintiną dovaną sau, draugams ar šeimai.
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

            <section className="gallery-section">
                <h2>Puzlių galerija</h2>
                <p className="gallery-description">
                    Peržiūrėkite kitų naudotojų viešai įkeltas dėliones.
                </p>

                {publicPuzzles.length === 0 ? (
                    <p>Galerijoje dar nėra viešų dėlionių.</p>
                ) : (
                    <div className="gallery-grid">
                        {publicPuzzles.map((puzzle) => (
                            <div
                                key={puzzle.puzzleId}
                                className="gallery-card"
                                onClick={() => handlePuzzleClick(puzzle.puzzleId)}
                            >
                                <div className="gallery-image-wrap">
                                    <img
                                        src={getImageUrl(puzzle.filePath)}
                                        alt={puzzle.originalFilename}
                                        className="gallery-image"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setZoomedPuzzle(puzzle);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="gallery-zoom-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setZoomedPuzzle(puzzle);
                                        }}
                                    >
                                        Padidinti
                                    </button>
                                </div>

                                <div className="gallery-card-content">
                                    <h3>{puzzle.originalFilename}</h3>
                                    <p>Autorius: {puzzle.username}</p>
                                    <p>Detalės: {puzzle.pieceCount}</p>
                                    <p>Santykis: {puzzle.aspectRatio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {zoomedPuzzle && (
                <div className="gallery-zoom-overlay" onClick={() => setZoomedPuzzle(null)}>
                    <div className="gallery-zoom-dialog" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="gallery-zoom-close"
                            onClick={() => setZoomedPuzzle(null)}
                            aria-label="Uždaryti"
                        >
                            ×
                        </button>
                        <img
                            src={getImageUrl(zoomedPuzzle.filePath)}
                            alt={zoomedPuzzle.originalFilename}
                            className="gallery-zoom-img"
                        />
                        <div className="gallery-zoom-details">
                            <strong>{zoomedPuzzle.originalFilename}</strong>
                            <span>Autorius: {zoomedPuzzle.username}</span>
                            <span>{zoomedPuzzle.pieceCount} detalės</span>
                            <span>{zoomedPuzzle.aspectRatio}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainPage;
