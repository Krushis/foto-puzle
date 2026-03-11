import React, { useState } from "react";
import "../styles/RegistrationPage.css";

function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5192/api/Example/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          phone,
          password
        })
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (response.ok) {
        setMessage(data?.message || "Registracija pavyko.");
      } else {
        setMessage(data?.message || "Registracija nepavyko.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage("Įvyko klaida siunčiant duomenis.");
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

        <input
          type="tel"
          placeholder="Telefono numeris (nebūtinas)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Slaptažodis"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registruotis</button>
      </form>

      {message && <p className="register-message">{message}</p>}
    </div>
  );
}

export default RegistrationPage;