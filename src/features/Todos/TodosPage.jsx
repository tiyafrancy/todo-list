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
    dispatch({
        type: TODO_ACTIONS.SET_FILTER,
        payload: newTerm,
    });
  };

  useEffect(() => {

    if(!token) return;

    async function fetchTodos() {

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

            dispatch({
                type: TODO_ACTIONS.FETCH_SUCCESS,
                payload: data.tasks || [],
            });

        } catch (err) {
            const isFilterOrSortActive = debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'asc';

                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {
                        message: isFilterOrSortActive ? `Error filtering/sorting todos: ${err.message}` : err.message || 'An error occurred while fetching todos',
                        isFilterError: isFilterOrSortActive,
                    }
                });
            }
    }

    fetchTodos();

  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  async function addTodo(todoTitle){


    const newTodo = {
      id : Date.now(),
      title : todoTitle,
      isCompleted : false
    };

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
        dispatch({
            type: TODO_ACTIONS.ADD_TODO_SUCCESS,
            payload: {
                tempId: newTodo.id,
                savedTodo,
            },
        });
    } catch (err) {

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

    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_START,
        payload: originalTodo,
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

        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (err) {

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

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

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

        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS});
    } catch (err) {

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
                type: TODO_ACTIONS.SET_SORT,
                payload: { sortBy: newSortBy, sortDirection },
            })
        }
        onSortDirectionChange={(newSortDirection) =>
            dispatch ({
                type: TODO_ACTIONS.SET_SORT,
                payload: { sortBy, sortDirection: newSortDirection },
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
