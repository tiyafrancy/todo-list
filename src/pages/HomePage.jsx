import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./HomePage.module.css";

function HomePage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/todos', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className={styles.container}>
            <p className={styles.text}>Redirecting...</p>
        </div>
    );
}

export default HomePage;