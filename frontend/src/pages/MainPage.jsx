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

    const getUserId = () => {
        const currentUser = auth.getUser();
        return currentUser?.userId ?? currentUser?.id ?? currentUser?.UserId;
    };

    const getPuzzleId = (puzzle) => {
        return puzzle?.puzzleId ?? puzzle?.id ?? puzzle?.PuzzleId ?? puzzle?.Id;
    };

    const getImageUrl = (filePath) => {
        if (!filePath) return "";
        if (filePath.startsWith("http")) return filePath;
        return `${API_BASE_URL}${filePath}`;
    };

    const loadPublicPuzzles = async () => {
        try {
            const userId = getUserId() || "";

            const res = await apiFetch(`/api/puzzle/public?userId=${userId}`);

            if (!res.ok) {
                throw new Error("Nepavyko įkelti galerijos");
            }

            const data = await res.json();
            setPublicPuzzles(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadPublicPuzzles();
    }, []);

    const handlePuzzleClick = (puzzleId) => {
        if (!auth.isLoggedIn()) {
            alert("Norėdami užsisakyti dėlionę, pirmiausia prisijunkite.");
            navigate("/login");
            return;
        }

        navigate(`/puzzle/${puzzleId}`);
    };

    const likePuzzle = async (puzzleId) => {
        const userId = getUserId();

        if (!userId) {
            alert("Pirmiausia prisijunkite.");
            navigate("/login");
            return;
        }

        try {
            const res = await apiFetch(`/api/puzzle-like/${puzzleId}`, {
                method: "POST",
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Nepavyko palaikinti.");
                return;
            }

            setPublicPuzzles((prev) =>
                prev.map((p) =>
                    getPuzzleId(p) === puzzleId
                        ? {
                              ...p,
                              likesCount: data.likesCount ?? data.LikesCount ?? 0,
                              isLikedByCurrentUser: true,
                          }
                        : p
                )
            );
        } catch (err) {
            console.error(err);
            alert("Klaida spaudžiant like.");
        }
    };

    const unlikePuzzle = async (puzzleId) => {
        const userId = getUserId();

        if (!userId) {
            alert("Pirmiausia prisijunkite.");
            navigate("/login");
            return;
        }

        try {
            const res = await apiFetch(`/api/puzzle-like/${puzzleId}/${userId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Nepavyko nuimti like.");
                return;
            }

            setPublicPuzzles((prev) =>
                prev.map((p) =>
                    getPuzzleId(p) === puzzleId
                        ? {
                              ...p,
                              likesCount: data.likesCount ?? data.LikesCount ?? 0,
                              isLikedByCurrentUser: false,
                          }
                        : p
                )
            );
        } catch (err) {
            console.error(err);
            alert("Klaida nuimant like.");
        }
    };

    const toggleLike = (e, puzzle) => {
        e.stopPropagation();

        const puzzleId = getPuzzleId(puzzle);

        if (!puzzleId) {
            alert("Nerastas puzzle ID.");
            return;
        }

        if (puzzle.isLikedByCurrentUser) {
            unlikePuzzle(puzzleId);
        } else {
            likePuzzle(puzzleId);
        }
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
                        {publicPuzzles.map((puzzle) => {
                            const puzzleId = getPuzzleId(puzzle);

                            return (
                                <div
                                    key={puzzleId}
                                    className="gallery-card"
                                    onClick={() => handlePuzzleClick(puzzleId)}
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

                                        <button
                                            type="button"
                                            className="gallery-like-button"
                                            onClick={(e) => toggleLike(e, puzzle)}
                                        >
                                            {puzzle.isLikedByCurrentUser ? "❤️" : "🤍"}{" "}
                                            {puzzle.likesCount ?? 0}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {zoomedPuzzle && (
                <div
                    className="gallery-zoom-overlay"
                    onClick={() => setZoomedPuzzle(null)}
                >
                    <div
                        className="gallery-zoom-dialog"
                        onClick={(e) => e.stopPropagation()}
                    >
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
                            <span>Patinka: {zoomedPuzzle.likesCount ?? 0}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainPage;