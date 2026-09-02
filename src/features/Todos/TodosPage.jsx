import { useEffect, useReducer } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import useDebounce from '../../utils/useDebounce.js'
import FilterInput from '../../shared/FilterInput.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
    todoReducer,
    initialTodoState,
    TODO_ACTIONS,
} from '../../reducers/todoReducer.js';

function TodosPage() {

//   const [todoList, setTodoList] = useState([]);
//   const [error, setError] = useState('');
//   const [isTodoListLoading, setIsTodoListLoading] = useState(false);
//   const [sortBy, setSortBy] = useState('createdAt');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [filterTerm, setFilterTerm] = useState('');
//   const [filterError, setFilterError] = useState('');
//   const [dataVersion, setDataVersion] = useState(0);

  const { token } = useAuth();  
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const {
    todoList,
    error,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    filterError,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const handleFilterChange = (newTerm) => {
    // setFilterTerm(newTerm);
    dispatch({
        type: TODO_ACTIONS.SET_FILTER,
        payload: newTerm,
    });
  };

//   const invalidateCache = useCallback(() => {
//     // setDataVersion((prev) => prev + 1);
//     dispatch({ type: TODO_ACTIONS.INVALIDATE_CACHE });
//   }, []);

  useEffect(() => {

    if(!token) return;

    async function fetchTodos() {
        // setIsTodoListLoading(true);
        // setError('');
        dispatch({ type: TODO_ACTIONS.FETCH_START });

        const paramsObject = {
            sortBy,
            sortDirection,
        };

        if (debouncedFilterTerm) {

            paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        try {
            const response = await fetch(`/api/tasks?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
            });

            if(response.status === 401) {
                throw new Error('Unauthorized access');
            }

            if(!response.ok) {
                throw new Error('Failed to fetch todo list');
            }

            const data = await response.json();
            // setTodoList(data.tasks || []);
            // setFilterError('');
            dispatch({
                type: TODO_ACTIONS.FETCH_SUCCESS,
                payload: data.tasks || [],
            });

        } catch (err) {
            if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
                // setFilterError(`Error filtering/sorting todos: ${err.message}`);
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {
                        message: `Error filtering/sorting todos: ${err.message}`,
                    }
                });
            }
            else {
                // setError(err.message || 'An error occurred while fetching todos');
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: err.message || 'An error occurred while fetching todos',
                });
            }
            
        } finally {
            // setIsTodoListLoading(false);
        }
    }

    fetchTodos();

  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  async function addTodo(todoTitle){

    // setError('');

    const newTodo = {
      id : Date.now(),
      title : todoTitle,
      isCompleted : false
    };

    // setTodoList((previous) => [newTodo, ...previous]);
    dispatch({
        type: TODO_ACTIONS.ADD_TODO_START,
        payload: newTodo,
    });

    try {

        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
            body: JSON.stringify({
                title: todoTitle,
                isCompleted: false,
            }),
        });

        if(!response.ok) {

            throw new Error('Failed to create todo');
        }

        const savedTodo = await response.json();
        // setTodoList((previous) => previous.map((todo) => (todo.id === newTodo.id ? savedTodo : todo)));
        // invalidateCache();
        dispatch({
            type: TODO_ACTIONS.ADD_TODO_SUCCESS,
            payload: {
                tempId: newTodo.id,
                savedTodo,
            },
        });
    } catch (err) {

        // setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id));
        // setError(err.message || 'Could not save todo. Please try again.');
        dispatch({
            type: TODO_ACTIONS.ADD_TODO_ERROR,
            payload: {
                tempId: newTodo.id,
                message: err.message || 'Could not save todo. Please try again.',
            },
        });
    }
  }

  async function completeTodo(id) {

    // setError('');

    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    // setTodoList((previous) => previous.map((todo) => (todo.id === id ? { ...todo, isCompleted: true } : todo)));
    dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_START,
        payload: id,
    });

    try {

        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
            body: JSON.stringify({
                isCompleted: true,
            }),
        });

        if (!response.ok) {

            throw new Error('Failed to update todo');
        }
        // invalidateCache();
        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (err) {

        // setTodoList((previous) => previous.map((todo) => (todo.id === id ? originalTodo : todo)));
        // setError(err.message || 'Could not complete task. Please try again.');
        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
            payload: {
                originalTodo,
                message: err.message || 'Could not complete task. Please try again.',
            },
        });
    }
  }

  async function updateTodo(editedTodo) {

    // setError('');

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    // setTodoList((previous) => previous.map((todo) => (todo.id === editedTodo.id ? { ...todo, ...editedTodo }: todo)));
    dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_START,
        payload: editedTodo,
    });

    try {

        const response = await fetch(`/api/tasks/${editedTodo.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
            body: JSON.stringify({
                title: editedTodo.title,
                isCompleted: editedTodo.isCompleted,
            }),
        });

        if (!response.ok) {

            throw new Error('Failed to update todo');
        }
        // invalidateCache();
        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS});
    } catch (err) {

        // setTodoList((previous) => previous.map((todo) => todo.id === editedTodo.id ? originalTodo : todo));
        // setError(err.message || 'Could not update todo. Please try again.');
        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_ERROR,
            payload: {
                originalTodo,
                message: err.message || 'Could not update todo. Please try again.',
            },
        });
    }
  }

  return (
    <div>
      <h1>Todo List</h1>

      {error && (
        <div>
            <p>{error}</p>
            {/* <button onClick={() => setError('')}>Clear Error</button> */}
            <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>
                Clear Error
            </button>
        </div>
      )}

      {filterError && (
        <div>
            <p>{filterError}</p>
            <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>
                Clear Filter Error
            </button>
            <button onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}>
                Reset Filters
            </button>
        </div>
      )}


      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) => 
            dispatch ({
                type: TODO_ACTIONS.SET_SORT_BY,
                payload: newSortBy,
            })
        }
        onSortDirectionChange={(newSortDirection) =>
            dispatch ({
                type: TODO_ACTIONS.SET_SORT_DIRECTION,
                payload: newSortDirection,
            })
        }
        />

        <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
        />

      <TodoForm onAddTodo={addTodo} />

        <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        />
    </div>
  );
}

export default TodosPage;
