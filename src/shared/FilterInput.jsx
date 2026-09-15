
import styles from "./TextInputWithLabel.module.css";

function FilterInput({ filterTerm, onFilterChange }) {

    return (

        <div className={styles.wrapper}>
            <label htmlFor="filterInput" className={styles.label}>Search todos:</label>
            <input
                id="filterInput"
                type="text"
                className={styles.input}
                value={filterTerm}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="Search by title..."
            />
        </div>
    );
}

export default FilterInput;