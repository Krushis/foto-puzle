import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { auth } from "../utils/auth";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5192/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                auth.saveToken(data.token); 
                //localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/");
            } else {
                setError(data.message || "Prisijungimas nepavyko");
            }
        } catch {
            setError("Nepavyko prisijungti prie serverio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Prisijungimas</h1>
            {loading && (
            <div className="loader-overlay">
                <LoadingSpinner size="large" color="white" />
            </div>
            )}

            <form className="login-form" onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="El. paštas"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Slaptažodis"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="login-error">{error}</p>}

                <button type="submit">Prisijungti</button>
            </form>
        </div>
    );
}

export default LoginPage;