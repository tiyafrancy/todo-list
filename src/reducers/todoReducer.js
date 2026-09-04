
export const TODO_ACTIONS = {

    // Fetch operations
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',

    // Add todo operations
    ADD_TODO_START: 'ADD_TODO_START',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',

    // Complete todo operations
    COMPLETE_TODO_START: 'COMPLETE_TODO_START',
    COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
    COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

    // Update todo operations
    UPDATE_TODO_START: 'UPDATE_TODO_START',
    UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
    UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

    // UI operations
    SET_SORT: 'SET_SORT',
    SET_FILTER: 'SET_FILTER',

    CLEAR_ERROR: 'CLEAR_ERROR',
    CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
    RESET_FILTERS: 'RESET_FILTERS',

};

export const initialTodoState = {
    todoList: [],
    error: '',
    isTodoListLoading: true,
    sortBy: 'createdAt',
    sortDirection: 'asc',
    filterTerm: '',
    filterError: '',
    dataVersion: 0,
};

export function todoReducer(state, action) {
    switch (action.type) {

        // Fetch operations
        case TODO_ACTIONS.FETCH_START:
            return {
                ...state,
                isTodoListLoading: true,
                error: '',
                filterError: '',
            };

        case TODO_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: action.payload,
                error: '',
                filterError: '',
                dataVersion: state.dataVersion + 1,
            };

        case TODO_ACTIONS.FETCH_ERROR: {

            const errorMessage = typeof action.payload === 'object' && action.payload !== null ? action.payload.message : action.payload;

            const isFilterError = typeof action.payload === 'object' && Boolean(action.payload?.isFilterError);

            return {
                ...state,
                isTodoListLoading: false,
                error: isFilterError ? '' : errorMessage || 'An error occurred while fetching todos',
                filterError: isFilterError ? errorMessage || 'Error filtering/sorting todos' : '',
            };
        }

        // Add todo operations
        case TODO_ACTIONS.ADD_TODO_START:
            return {
                ...state,
                error: '',
                filterError: '',
                todoList: [action.payload, ...state.todoList],
            };

        case TODO_ACTIONS.ADD_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map((todo) => todo.id === action.payload.tempId ? action.payload.savedTodo : todo),
                dataVersion: state.dataVersion + 1,
            };

        case TODO_ACTIONS.ADD_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.filter((todo) => todo.id !== action.payload.tempId),
                error: action.payload.message || 'Could not save todo. Please try again.',
            };

        // Complete todo operations
        case TODO_ACTIONS.COMPLETE_TODO_START:
            return {
                ...state,
                error: '',
                todoList: state.todoList.map((todo) => todo.id === action.payload.id ? { ...todo, isCompleted: true } : todo),
            };

        case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
            return {
                ...state,
                dataVersion: state.dataVersion + 1,
            };

        case TODO_ACTIONS.COMPLETE_TODO_ERROR:
            return {
                ...state,
                error: '',
                filterError: '',
                todoList: state.todoList.map((todo) => todo.id === action.payload.originalTodo.id ? action.payload.originalTodo : todo),
            };

        // Update todo operations
        case TODO_ACTIONS.UPDATE_TODO_START:
            return {
                ...state,
                error: '',
                filterError: '',
                todoList: state.todoList.map((todo) => todo.id === action.payload.id ? { ...todo, ...action.payload } : todo),
            };

        case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
            return {
                ...state,
                dataVersion: state.dataVersion + 1,
            };

        case TODO_ACTIONS.UPDATE_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.map((todo) => todo.id === action.payload.originalTodo.id ? action.payload.originalTodo : todo),
                error: action.payload.message || 'Could not update todo. Please try again.',
            };

        // UI operations

        case TODO_ACTIONS.SET_SORT:
            return {
                ...state,
                sortBy: action.payload.sortBy ?? state.sortBy,
                sortDirection: action.payload.sortDirection ?? state.sortDirection,
                error: '',
                filterError: '',
            };

        case TODO_ACTIONS.SET_FILTER:
            return {
                ...state,
                filterTerm: action.payload,
                error: '',
                filterError: '',
            };

        case TODO_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: '',
            };

        case TODO_ACTIONS.CLEAR_FILTER_ERROR:
            return {
                ...state,
                filterError: '',
            }

        case TODO_ACTIONS.RESET_FILTERS:
            return {
                ...state,
                filterTerm: '',
                sortBy: 'createdAt',
                sortDirection: 'asc',
                error: '',
                filterError: '',
                dataVersion: state.dataVersion + 1,
            };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}