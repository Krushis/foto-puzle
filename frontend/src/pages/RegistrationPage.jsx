import React, { useState } from "react";
import "../styles/RegistrationPage.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { apiFetch } from "../utils/api";


function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  //const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (response.ok) {
        setMessage(data?.message || "Registracija pavyko.");
      } else {
        setMessage(data?.message || "Registracija nepavyko.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage("Įvyko klaida siunčiant duomenis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Registracija</h1>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Vartotojo vardas"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="El. paštas"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/*}
        <input
          type="tel"
          placeholder="Telefono numeris (nebūtinas)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
          */}
        <input
          type="password"
          placeholder="Slaptažodis"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registruojama..." : "Registruotis"}
        </button>
      </form>

      {message && <p className="register-message">{message}</p>}
    </div>
  );
}

export default RegistrationPage;
