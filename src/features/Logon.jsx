import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function Logon() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    const { login } = useAuth();

    async function handleSubmit(event) {

        event.preventDefault();
        setIsLoggingOn(true);
        setAuthError('');

        try {
            // const response = await fetch('/api/users/logon', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     credentials: 'include',
            //     body: JSON.stringify({ email, password })
            //   });

            // const data = await response.json();

            // if (response.status === 200 && data.name && data.csrfToken) {
            //     onSetEmail(data.name);
            //     onSetToken(data.csrfToken);
            // } else {
            //     setAuthError(`Authentication failed: ${data?.message || 'Invalid credentials'}`);
            // }

            const result = await login(email, password);

            if (!result.success) {
                setAuthError(result.error);
            }

        }catch (error) {

            setAuthError(`Error: ${error.name} | ${error.message}`);

        }
        finally {

            setIsLoggingOn(false);

        }
    }

    return(
        <form onSubmit={handleSubmit}>
            {authError && (
                <div>
                    <p>{authError}</p>
                </div>
            )}

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </div>

            <button type="submit" disabled={isLoggingOn}>
                {isLoggingOn ? 'Logging in...' : 'Log On'}
            </button>
        </form>
    );
}

export default Logon;