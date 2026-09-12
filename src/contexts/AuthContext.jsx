import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        try {
            const savedToken = localStorage.getItem('csrfToken');
            const savedName = localStorage.getItem('userName');
            const savedEmail = localStorage.getItem('userEmail');

            if (savedToken) {
                setToken(savedToken);
                setName(savedName || '');
                setEmail(savedEmail || '');
            }
        }catch (err) {
            console.error('Failed to restore auth from storage', err);
        }finally {
            setIsAuthLoading(false);
        }
    }, []);
    
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

        if (res.status === 200 && data.csrfToken) {
            const userName = data.name || userEmail.split('@')[0];

            setName(userName);
            setEmail(userEmail);
            setToken(data.csrfToken);

            localStorage.setItem('csrfToken', data.csrfToken);
            localStorage.setItem('userName', userName);
            localStorage.setItem('userEmail', userEmail);

            return { success: true };
            }else {
                return {
                    success: false,
                    error: `Authentication failed: ${data?.message} || 'Invalid credentials'}`,
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

        const clearLocalAuth = () => {
            setName('');
            setEmail('');
            setToken('');
            localStorage.removeItem('csrfToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
        };

        if (!token) {
            clearLocalAuth();
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

            const res = await fetch('/api/users/logoff', options);

            if (!res.ok) throw new Error('Logout failed');

                clearLocalAuth();
                return { success: true };

        } catch(error) {
            clearLocalAuth();
            return {
                success: false,
                error: error.message,
            };
        }
    };

    const value = {
        name,
        email,
        token,
        user: { name, email },
        isAuthenticated: !!token,
        isAuthLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}