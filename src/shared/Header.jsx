import { useAuth } from "../contexts/AuthContext";
import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";
import styles from "./Header.module.css";

function Header() {

    const { isAuthenticated } = useAuth();

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Todo List</h1>
            <Navigation />
            {isAuthenticated && <Logoff />}
        </header>
    );
}

export default Header;