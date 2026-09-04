import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [isLoggingOff, setIsLoggingOff] = useState(false);
    const [authError, setAuthError] = useState('');
    
    const login = async (userEmail, password) => {
        try {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, password }),
                credentials: 'include',
            };

        const res = await fetch('/api/users/logon', options);
        const data = await res.json();

        if (res.status === 200 && data.name && data.csrfToken) {

            setEmail(data.name);
            setToken(data.csrfToken);
            setAuthError('');
            return { success: true };
            }else {
            const errorMsg = `Authentication failed: ${data?.message || 'Invalid response'}`;
            setAuthError(errorMsg);
            return {
                success: false,
                error: errorMsg,
            };
            }
        } catch {
            const errorMsg = 'Network error during login';
            setAuthError(errorMsg);
            return {
                success: false,
                error: errorMsg,
            };
        } 
    };

    const logout = async() => {
        setIsLoggingOff(true);
        setAuthError('');

        if (!token) {
            setEmail('');
            setToken('');
            setIsLoggingOff(false);
            return { success: true };
        }

        try {
            
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': token,
                },
                credentials: 'include',
            };

            const res = await fetch('/api/user/logoff', options);

            if (res.ok) {
                setEmail('');
                setToken('');
                return { success: true };
            } else {
                const errorMsg = 'Failed to log out on server.';
                setAuthError(errorMsg);
                return {
                    success: false,
                    error: errorMsg,
                };
            }
        } catch {
            const errorMsg = 'Network error during logout';
            setAuthError(errorMsg);
            return {
                success: false,
                error: errorMsg,
            };
        } finally {
            setEmail('');
            setToken('');
            setIsLoggingOff(false);
        }
    };

    const value = {
        email,
        token,
        isAuthenticated: !!token,
        isLoggingOff,
        authError,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}