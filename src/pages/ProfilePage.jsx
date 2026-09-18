import { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext.jsx';
import styles from './ProfilePage.module.css';

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
        <div className={styles.container}>
            <h2 className={styles.title}>User Profile</h2>

            <section className={styles.card}>
                <h3 className={styles.cardTitle}>Account Details</h3>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{email}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Status</span>
                    <span className={styles.statusBadge}>Logged In</span>
                </div>
            </section>

            <section className={styles.card}>
                <h3 className={styles.cardTitle}>Todo Statistics</h3>

                {isLoading && <p className={styles.cardTitle}>Loading stats...</p>}

                {error && <div className={styles.errorBanner}>{error}</div>}

                {!isLoading && !error && stats && (
                    <div>
                        <ul className={styles.statsList}>
                            <li className={styles.statItem}>
                                <span className={styles.statNumber}>{stats.total}</span>
                                <span className={styles.statLabel}>Total</span>
                                </li>
                            <li className={styles.statItem}>
                                <span className={styles.statNumber}>{stats.completed}</span>
                                <span className={styles.statLabel}>Completed</span>
                            </li>
                            <li className={styles.statItem}>
                                <span className={styles.statNumber}>{stats.active}</span>
                                <span className={styles.statLabel}>Active</span>
                            </li>
                        </ul>

                        {stats.total > 0 && (
                            <div className={styles.rateContainer}>
                                <div className={styles.rateHeader}>
                                    <span>Completion Rate</span>
                                    <span>{completionPercentage}%</span>
                                </div>
                                <div className={styles.progressBarTrack}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{width: `${completionPercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ProfilePage;
