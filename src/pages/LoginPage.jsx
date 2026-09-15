import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";
import styles from "./LoginPage.module.css";

function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    const from = location.state?.from?.pathname || '/todos';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    async function handleSubmit(event) {
        event.preventDefault();
        setAuthError('');

        const result = await login(email, password);

        if (result?.success) {
            navigate(from, { replace: true});
        }else {
            setAuthError(result?.error || 'Login failed. Please try again.')
        }

    }

    return(
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Sign In</h2>
                {authError && <div className={styles.errorBanner}>{authError}</div>}
            
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}> 
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>Log in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;