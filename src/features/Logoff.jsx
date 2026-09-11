import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function Logoff() {

    const { logout} = useAuth();
    const navigate = useNavigate();
    const [isLoggingOff, setIsLoggingOff] = useState(false);
    const [error, setError] = useState('');

    const handleLogoff = async () => {
        setIsLoggingOff(true);
        setError('');

        try {
            const result = await logout();

            if (result.success) {
                navigate('/login');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
                        
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