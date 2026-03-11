import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

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
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/");
            } else {
                setError(data.message || "Prisijungti nepavyko");
            }
        } catch {
            setError("Nepavyko prisijungti prie serverio");
        }
    };

    return (
        <div className="login-container">
            <h1>Prisijungti</h1>

            <form className="login-form" onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="El. pastas"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Slaptazodis"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="login-error">{error}</p>}

                <button type="submit">Prisijungti</button>
            </form>

            <p className="dummy-info">
                Testiniai duomenys: admin@foto.lt / 123456
            </p>
        </div>
    );
}

export default LoginPage;