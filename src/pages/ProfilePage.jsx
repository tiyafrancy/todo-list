import { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext.jsx';

function ProfilePage(){
    const { email, token, isAuthenticated } = useAuth();
    const [stats, setStats] = useState({ total: 0 , completed: 0, active: 0});
    const [isLoading, setIsLoading] = useState(false);
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
                const todos = Array.isArray(data.tasks) ? data.tasks : [];

                const total = todos.length;
                const completed = todos.filter((todo) => todo.isCompleted).length;
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
                <p>Name: {email}</p>
                <p>Status: {isAuthenticated ? 'Logged in' : 'Logged out'}</p>
            </section>

            <section>
                <h3>Todo Stats</h3>
                {isLoading && <p>Loading stats...</p>}
                {error && <p className='error'>{error}</p>}
                {!isLoading && !error && (
                    <div>
                        <ul>
                            <li>Total todos: {stats.total}</li>
                            <li>Completed todos: {stats.completed}</li>
                            <li>Active/Pending: {stats.active}</li>
                        </ul>
                        {stats.total > 0 && <p>Completion Rate: {completionPercentage}%</p>}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ProfilePage;
