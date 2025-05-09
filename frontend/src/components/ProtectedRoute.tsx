import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ReactNode } from "react";

interface Props {
    allowedRoles: string[] | null;
    children: ReactNode;
};

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />
    }

    // Is allowedRoles is null/undefined and a user is logged in,
    // grants all permissions
    if (!allowedRoles) {
        return children;
    }
    
    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/login" />
    }

    return children;
};

export default ProtectedRoute;
