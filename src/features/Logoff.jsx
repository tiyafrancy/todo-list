import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Logoff() {

    const { email, logout } = useAuth();
    const [ error, setError] = useState('');
    const [ isLoggingOff, setIsLoggingOff] = useState(false);

    const handleLogoff = async () => {
        setIsLoggingOff(true);
        setError('');

        const result = await logout();

        if (!result.success) {
            setError(result.error);
            setIsLoggingOff(false);
        }
    };

    return (
        <div>
            {email && <span>Logged in as: {email}</span>}
            {error && <p className="error">{error}</p>}
            <button onClick={handleLogoff} disabled={isLoggingOff}>
                {isLoggingOff ? 'Logging off...' : 'Log Off'}
            </button>
        </div>
    );
}

export default Logoff;