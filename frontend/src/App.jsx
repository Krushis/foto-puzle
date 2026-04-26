import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import MainPage from "./pages/MainPage";
import CheckOutPage from "./pages/CheckOutPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/checkout" element={<CheckOutPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;