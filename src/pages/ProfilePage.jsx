import { useState, useEffect } from "react";
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProfilePage(){
    const { user, token } = useAuth();
    const [stats, setStats] = useState({ total: 0 , completed: 0, active: 0});
    const [isLoading, setIsLoading] = useState(true);
    const [ error, setError] = useState('');

    useEffect(() => {
        async function fetchTodoStats() {
            if (!token) return;

            try {
                setIsLoading(true);

                const response = await fetch('/api/todos', {
                    headers: {
                        Authorization:`Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch todo statistics.');
                }

                const todos = await response.json();
                const total = todos.length;
                const completed = todos.filter((todo) => todo.completed).length;
                const active = total - completed;

                setStats({ total, completed, active });
            } catch (err) {
                setError(err.message || 'An error occurred while loading stats.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchTodoStats();
    }, [token]);

    return (
        <div>
            <h2>User Profile</h2>

            <section>
                <h3>Account Details</h3>
                <p>Name/Email: {user?.name || user?.email || 'N/A' }</p>
            </section>

            <section>
                <h3>Todo Stats</h3>
                {isLoading ? (
                    <p>Loading stats...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <ul>
                        <li>Total todos: {stats.total}</li>
                        <li>Completed todos: {stats.completed}</li>
                        <li>Active/Pending: {stats.active}</li>
                    </ul>
                )}
            </section>

            <div>
                <Link to="todos">View MY Todos</Link>
            </div>
        </div>
    )
}

export default ProfilePage;
