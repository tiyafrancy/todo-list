import { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext.jsx';

function ProfilePage(){
    const { email, token} = useAuth();
    const [stats, setStats] = useState({ total: 0 , completed: 0, active: 0});
    const [isLoading, setIsLoading] = useState(true);
    const [ error, setError] = useState('');

    useEffect(() => {
        async function fetchTodoStats() {

            try {
                setIsLoading(true);
                setError('');

                if (!token) { 
                    setIsLoading(false);
                    return;
                 }

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

                const todoList = data.tasks || data || [];
                const total = todoList.length;
                const completed = todoList.filter((todo) => todo.isCompleted).length;
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

    const totalCount = stats.total || 0;
    const completedCount = stats?.completed || 0;
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div>
            <h2>User Profile</h2>

            <section>
                <h3>Account Details</h3>
                <p>Name: {email}</p>
                <p>Status: Logged in</p>
            </section>

            <section>
                <h3>Todo Stats</h3>
                {isLoading && <p>Loading stats...</p>}

                {error && <p className='error'>{error}</p>}

                {!isLoading && !error && stats && (
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
