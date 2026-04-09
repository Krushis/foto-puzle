// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import LoadingSpinner from "../components/LoadingSpinner";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/");
      return;
    }

    //fetch(`http://localhost:5192/api/user/${userId}`) - hardcoded value
    fetch(`http://localhost:5192/api/user/${user.id}`) // ✅  // fix this later
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load profile.");
        setLoading(false);
      });
  }, [navigate]);

  if (error) return <p>{error}</p>;
  //if (!profile) return <p>Loading...</p>;
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
        <button className="back-button" onClick={() => navigate("/")}>
          ← Grįžti į pagrindinį
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;