import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <h1>Foto-Puzlė</h1>
      <p>
        Užsisakykite savo unikalią dėlionę iš bet kurios nuotraukos!
        Tai puiki dovana arba linksmas projektas šeimai ir draugams.
      </p>

      <button
        className="register-button"
        onClick={() => navigate("/register")}
      >
        Registruotis
      </button>
    </div>
  );
}

export default MainPage;