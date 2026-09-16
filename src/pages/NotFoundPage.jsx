import { Link } from 'react-router';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>404 - Page Not Found</h2>
            <p className={styles.description}>
                The page you are looking for does not exist or has been moved.
            </p>

            <div className={styles.navGroup}>
                <Link to="/todos" className={styles.linkButton}>Go to Todos</Link>
                <Link to="/about" className={styles.linkButton}>About</Link>
                <Link to="/login" className={styles.linkButton}>Login</Link>
            </div>
        </div>
    )
}

export default NotFoundPage;