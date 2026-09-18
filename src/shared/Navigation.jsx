import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Navigation.module.css";

function Navigation() {
    const { isAuthenticated } = useAuth();

    const getNavLinkClass = ({ isActive }) => `${styles.button} ${isActive ? styles.active : ""}`.trim();

    return (
        <nav>
            <ul className={styles.container}>
                <li>
                    <NavLink to="/about" className={getNavLinkClass}>
                        About
                    </NavLink>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to="/todos" className={getNavLinkClass}>
                                Todos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" className={getNavLinkClass}>
                                Profile
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <li>
                        <NavLink to="/login" className={getNavLinkClass}>
                            Login 
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;