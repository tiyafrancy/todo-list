import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Logoff.module.css";

function Logoff() {

    const { logout} = useAuth();
    const navigate = useNavigate();
    const [isLoggingOff , setIsLoggingOff] = useState(false);
    const [error, setError] = useState('');

    const handleLogoff = async () => {
        setError('');
        setIsLoggingOff(true);

        const result = await logout();

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error);
            setIsLoggingOff(false);
        }
    };

    return (
        <div className={styles.container}>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <button 
                type='button' 
                onClick={handleLogoff} 
                disabled={isLoggingOff}
                className={styles.button}
            >
                {isLoggingOff ? 'Logging out...' : 'Log out'}
            </button>
        </div>
    );
}

export default Logoff;