import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { auth } from "../utils/auth";
import { apiFetch } from "../utils/api";

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [puzzles, setPuzzles] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.getUser();

        if (!user) {
            navigate("/");
            return;
        }

        fetch(`http://localhost:5192/api/user/${user.id}/puzzles`)
            .then(res => res.json())
            .then(data => setPuzzles(data));


        <h3>Mano dėlionės</h3>

        {
            puzzles.map(p => (
                <div key={p.id}>
                    🧩 {p.pieceCount} dalių – {new Date(p.createdAt).toLocaleDateString()}
                </div>
            ))
        }

        Promise.all([
            apiFetch(`/api/user/${user.userId}`),
            apiFetch(`/api/user/${user.userId}/puzzles`)
        ])
            .then(async ([profileRes, puzzlesRes]) => {
                if (!profileRes.ok || !puzzlesRes.ok) {
                    throw new Error("Failed to load profile");
                }

                const profileData = await profileRes.json();
                const puzzlesData = await puzzlesRes.json();

                setProfile(profileData);
                setPuzzles(puzzlesData);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load profile.");
                setLoading(false);
            });
    }, [navigate]);

    if (error) return <p>{error}</p>;
    if (loading) return <LoadingSpinner size="large" color="black" />;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1>👤 {profile.username}</h1>
                <p>{profile.email}</p>
                <p>Narys nuo {new Date(profile.createdAt).toLocaleDateString()}</p>

                <div className="profile-stats">
                    <span>📷 {profile.totalPhotos} nuotraukos</span>
                    <span>🧩 {profile.totalPuzzles} dėlionės</span>
                </div>

                <h2 style={{ marginTop: "24px" }}>Mano sukurtos dėlionės</h2>

                {puzzles.length === 0 ? (
                    <p>Kol kas neturite sukurtų dėlionių.</p>
                ) : (
                    <div style={{ marginTop: "16px", display: "grid", gap: "16px" }}>
                        {puzzles.map((puzzle) => (
                            <div
                                key={puzzle.puzzleId}
                                style={{
                                    padding: "16px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    backgroundColor: "#fff"
                                }}
                            >
                                <p><strong>Dėlionės ID:</strong> {puzzle.puzzleId}</p>
                                <p><strong>Nuotrauka:</strong> {puzzle.originalFilename}</p>
                                <p><strong>Sunkumas:</strong> {puzzle.difficulty}</p>
                                <p><strong>Detalių skaičius:</strong> {puzzle.pieceCount}</p>
                                <p><strong>Statusas:</strong> {puzzle.status}</p>
                                <p><strong>Sukurta:</strong> {new Date(puzzle.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}

                <button className="back-button" onClick={() => navigate("/")}>
                    ← Grįžti į pagrindinį
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;