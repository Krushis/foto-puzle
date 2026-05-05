import { Navigate } from "react-router-dom";
import { auth } from "../utils/auth";

function ProtectedRoute({ children, requiredRole }) {
    const user = auth.getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
