import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";

function RequireAuth({ children }) {
    const { isAuthenticated, isAuthLoading  } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated && !isAuthLoading) {
            navigate('/login', { 
                state: { from: location }, 
                replace: true 
            });
        }
    }, [isAuthenticated, isAuthLoading, location, navigate]);

    if (isAuthLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isAuthenticated) {
        return children;
    }

    return null;
}

export default RequireAuth;