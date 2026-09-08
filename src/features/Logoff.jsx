import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Logoff() {

    const { logout} = useAuth();
    const [isLoggingOff, setIsLoggingOff] = useState(false);
    const [error, setError] = useState('');

    const handleLogoff = async () => {
        setIsLoggingOff(true);
        setError('');

        try {
            const result = await logout();
            if (!result.success) {
                setError(result.error);
            }

        } catch (err) {
            setError('An unexpected error occured.');
        } finally {
            setIsLoggingOff(false);
        }

    };

    return (
        <div>
            {error && <p>{error}</p>}
            <button onClick={handleLogoff}>
                Logoff
            </button>
        </div>
    );
}

export default Logoff;