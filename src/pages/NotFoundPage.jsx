import { Link } from 'react-router';

function NotFoundPage() {
    return (
        <div>
            <h2>404 - Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>

            <div>
                <Link to="/todos">Go to Todos</Link>
                <Link to="/about">About</Link>
                <Link to="/login">Login</Link>
            </div>
        </div>
    )
}

export default NotFoundPage;