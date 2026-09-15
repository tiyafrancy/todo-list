import styles from './AboutPage.module.css';

function AboutPage() {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>About Todo List App</h2>
            <p className={styles.description}>
                This app helps you to organize your daily todos efficiently.
            </p>

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Features</h3>
                <ul className={styles.list}>
                    <li className={styles.listItem}>User login & Authentication</li>
                    <li className={styles.listItem}>Add, Update, Complete, and Delete todo items</li>
                    <li className={styles.listItem}>Filter and Sort task lists</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Technologies used</h3>
                <ul className={styles.list}>
                    <li className={styles.listItem}>React</li>
                    <li className={styles.listItem}>React Router</li>
                    <li className={styles.listItem}>Vite</li>
                </ul>
            </section> 
        </div>
    );
}

export default AboutPage;