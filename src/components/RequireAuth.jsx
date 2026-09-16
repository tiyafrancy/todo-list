import { useLocation, Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";

function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

        if (!isAuthenticated) {
            return (
                <Navigate 
                    to='/login'
                    state={{ from: location }}
                    replace 
                />
            );
        }

    return children;
}

export default RequireAuth;