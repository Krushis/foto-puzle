import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderHistoryPage.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { auth } from "../utils/auth";
import { apiFetch } from "../utils/api";

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.getUser();
        if (!user) { navigate("/login"); return; }

        apiFetch(`/api/user/${user.userId}/orders`)
            .then(async (res) => {
                if (!res.ok) throw new Error();
                setOrders(await res.json());
            })
            .catch(() => setError("Nepavyko užkrauti užsakymų."))
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return <LoadingSpinner size="large" color="black" />;
    if (error) return <p>{error}</p>;

    return (
        <div className="orders-page">
            <div className="orders-container">
                <h1>Užsakymų istorija</h1>

                {orders.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#555" }}>
                        Kol kas neturite užsakymų.
                    </p>
                ) : (
                    orders.map((order) => (
                        <div key={order.orderId} className="order-card">
                            <p><strong>Užsakymo ID:</strong> {order.orderId}</p>
                            <p><strong>Dėlionės ID:</strong> {order.puzzleId}</p>
                            <p><strong>Suma:</strong> {Number(order.amount).toFixed(2)} €</p>
                            <p><strong>Statusas:</strong> {order.status}</p>
                            <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))
                )}

                <div className="orders-actions">
                    <button className="btn-back" onClick={() => navigate("/profile")}>
                        Grįžti į profilį
                    </button>
                    <button className="btn-home" onClick={() => navigate("/")}>
                        Pagrindinis
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderHistoryPage;