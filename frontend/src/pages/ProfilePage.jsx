import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { auth } from "../utils/auth";
import { apiFetch } from "../utils/api";

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [puzzles, setPuzzles] = useState([]);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingPassword, setSavingPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.getUser();

        if (!user) {
            navigate("/login");
            return;
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

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        setPasswordError("");
        setPasswordMessage("");

        if (newPassword.length < 6) {
            setPasswordError("Naujas slaptažodis turi būti bent 6 simbolių.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Nauji slaptažodžiai nesutampa.");
            return;
        }

        setSavingPassword(true);

        try {
            const response = await apiFetch(`/api/user/${profile.id}/password`, {
                method: "PUT",
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setPasswordError(data.message || "Nepavyko pakeisti slaptažodžio.");
                return;
            }

            setPasswordMessage(data.message);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            window.setTimeout(() => {
                auth.removeToken();
                navigate("/login");
            }, 1200);
        } catch {
            setPasswordError("Nepavyko prisijungti prie serverio.");
        } finally {
            setSavingPassword(false);
        }
    };

    if (error) return <p>{error}</p>;
    if (loading) return <LoadingSpinner size="large" color="black" />;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1>{profile.username}</h1>
                <p>{profile.email}</p>
                <p>Narys nuo {new Date(profile.createdAt).toLocaleDateString()}</p>

                <div className="profile-stats">
                    <span>{profile.totalPhotos} nuotraukos</span>
                    <span>{profile.totalPuzzles} dėlionės</span>
                </div>

                <form className="password-form" onSubmit={handlePasswordChange}>
                    <h2>Keisti slaptažodį</h2>

                    <input
                        type="password"
                        placeholder="Dabartinis slaptažodis"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Naujas slaptažodis"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Pakartokite naują slaptažodį"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                    />

                    {passwordError && <p className="password-error">{passwordError}</p>}
                    {passwordMessage && <p className="password-success">{passwordMessage}</p>}

                    <button type="submit" disabled={savingPassword}>
                        {savingPassword ? "Saugoma..." : "Išsaugoti slaptažodį"}
                    </button>
                </form>

                <h2 className="profile-section-title">Mano sukurtos dėlionės</h2>

                {puzzles.length === 0 ? (
                    <p>Kol kas neturite sukurtų dėlionių.</p>
                ) : (
                    <div className="puzzle-list">
                        {puzzles.map((puzzle) => (
                            <div key={puzzle.puzzleId} className="puzzle-card">
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
                    Grįžti į pagrindinį
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;
