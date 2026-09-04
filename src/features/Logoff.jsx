import { useAuth } from "../contexts/AuthContext";

function Logoff() {

    const { email, logout, isLoggingOff, authError} = useAuth();

    // const handleLogoff = async () => {
    //     setIsLoggingOff(true);
    //     setError('');

    //     const result = await logout();

    //     if (result && !result.success) {
    //         setError(result.error);
    //     }
    // };

    return (
        <div>
            {email && <span>Logged in as: {email}</span>}
            {authError && <p className="error">{authError}</p>}
            <button onClick={logout} disabled={isLoggingOff}>
                {isLoggingOff ? 'Logging off...' : 'Log Off'}
            </button>
        </div>
    );
}

export default Logoff;