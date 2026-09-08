import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Logoff() {

    const { logout} = useAuth();
    const [isLoggingOff, setIsLoggingOff] = useState(false);
    const [error, setError] = useState('');

    const handleLogoff = async () => {
        setIsLoggingOff(true);
        setError('');

        const result = await logout();
        if (result.success) {
            // Logout successful
        } else {
            setError(result.error);
            setIsLoggingOff(false);
        }

    };

    return (
        <div>
            <button onClick={handleLogoff} disabled={isLoggingOff}>
                {isLoggingOff ? <> Logging off...</> : <>Log Off</>}
            </button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Logoff;