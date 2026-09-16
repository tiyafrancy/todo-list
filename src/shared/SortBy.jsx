
import styles from "./Navigation.module.css";

function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {

    return (

        <div className={styles.container}>
            <div className={styles.group}>
                <label htmlFor="sortBySelect" className={styles.label}>Sort by:</label>
                <select 
                    id="sortBySelect"
                    className={styles.select}
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value)}
                    >
                    <option value="createdAt">Created At</option>
                    <option value="title">Title</option>
                </select>
            </div>

            <div className={styles.group}>
                <label htmlFor="sortDirectionSelect" className={styles.label}> Order:</label>
                <select
                    id="sortDirectionSelect"
                    className={styles.select}
                    value={sortDirection}
                    onChange={(e) => onSortDirectionChange(e.target.value)}
                    >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
        </div>
    );
}

export default SortBy;