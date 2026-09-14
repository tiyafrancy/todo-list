import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Navigation.module.css";

function Navigation() {
    const { isAuthenticated } = useAuth();

    const navLinkStyle = ({ isActive }) => 
        isActive
        ? {
            fontWeight: 'bold',
            textDecoration: 'underline',
        }
        : undefined;


    return (
        <nav>
            {/* <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', padding: 0 }}> */}
            <ul className={styles.container}>
                <li>
                    <NavLink to="/about" className={styles.button} style={navLinkStyle}>
                        About
                    </NavLink>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to="/todos" className={styles.button} style={navLinkStyle}>
                                Todos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" className={styles.button} style={navLinkStyle}>
                                Profile
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <li>
                        <NavLink to="/login" className={styles.button} style={navLinkStyle}>
                            Login 
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;