import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function Logoff() {

    const { logout} = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState('');

    const handleLogoff = async () => {
        setError('');


        const result = await logout();

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error);
        }
    };

    return (
        <div>
            <button type='button' onClick={handleLogoff}>
                Log off
            </button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Logoff;