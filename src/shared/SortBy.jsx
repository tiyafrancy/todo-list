
function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {

    return (

        <div className="sort-by-container">
            <label htmlFor="sortBySelect">Sort by</label>
            <select 
                id="sortBySelect"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
            >
                <option value="createdAt">Created At</option>
                <option value="title">Title</option>
            </select>

            <label htmlFor="sortDirectionSelect"> Order </label>
            <select
                id="sortDirectionSelect"
                value={sortDirection}
                onChange={(e) => onSortDirectionChange(e.target.value)}
            >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </div>
    );
}

export default SortBy;