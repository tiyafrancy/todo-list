import { createContext, useContext, useState} from "react";

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {

    const [email, setEmail] = useState(() => sessionStorage.getItem('auth_email') || '');
    const [token, setToken] = useState(() => sessionStorage.getItem('auth_token') || '');

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

            sessionStorage.setItem('auth_email', data.name);
            sessionStorage.setItem('auth_token', data.csrfToken);
            return { success: true };
            }else {
                return {
                    success: false,
                    error: `Authentication failed: ${data?.message || 'Invalid credentials'}`,
                };
            }
        } catch(error) {
            return {
                success: false,
                error: `Network error during login`,
            };
        } 
    };

    const logout = async() => {
        try {
            if (token) {
                const options = {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': token,
                    },
                    credentials: 'include',
                };
                await fetch('/api/users/logoff', options);
            }
        } catch(error) {
            return {
                error: 'Network error during logout',
            };
        }finally {
            setEmail('');
            setToken('');
            sessionStorage.removeItem('auth_email');
            sessionStorage.removeItem('auth_token');
        }
        return { success: true};
    };

    const value = {
        email,
        token,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}