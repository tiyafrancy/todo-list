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
                setError('');

                const options = {
                    method: 'GET',
                    headers: { 'X-CSRF-TOKEN': token },
                    credentials: 'include',
                };

                const response = await fetch('/api/tasks', options);

                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }

                if(!response.ok) {
                    throw new Error('Failed to fetch todos');
                }

                const data = await response.json();
                const todos = Array.isArray(data) ? data : data.tasks || [];

                const total = todos.length;
                const completed = todos.filter((todo) => todo.isCompleted || todo.completed).length;
                const active = total - completed;

                setStats({total, completed, active });
            } catch (err) {
                setError(`Error loading statistics: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTodoStats();
    }, [token]);

    const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

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
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div>
                        <ul>
                            <li>Total todos: {stats.total}</li>
                            <li>Completed todos: {stats.completed}</li>
                            <li>Active/Pending: {stats.active}</li>
                        </ul>
                        <p>Completion Rate: {completionPercentage}%</p>
                    </div>
                )}
            </section>

            <div>
                <Link to="todos">View MY Todos</Link>
            </div>
        </div>
    )
}

export default ProfilePage;
