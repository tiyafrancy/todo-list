import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';
import SortBy from '../shared/SortBy.jsx';
import useDebounce from '../utils/useDebounce.js'
import FilterInput from '../shared/FilterInput.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
    todoReducer,
    initialTodoState,
    TODO_ACTIONS,
} from '../reducers/todoReducer.js';
import StatusFilter from '../shared/StatusFilter.jsx';

function TodosPage() {

  const { token } = useAuth();  
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const statusFilter = searchParams.get('status') || 'all';

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
        payload: {filterTerm: newTerm },
    });
  };

  useEffect(() => {

    if(!token) {
        dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: { todos: [] },
        });
        return;
    }

    async function fetchTodos() {

        dispatch({ type: TODO_ACTIONS.FETCH_START });

        const paramsObject = {
            sortBy,
            sortDirection,
        };

        if (debouncedFilterTerm) {

            paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject).toString();

        try {
            const response = await fetch(`/api/tasks?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
            });

            // if(response.status === 401) {
            //     throw new Error('Unauthorized access');
            // }

            if(!response.ok) {
                throw new Error('Failed to fetch todo list');
            }

            const data = await response.json();
            dispatch({
                type: TODO_ACTIONS.FETCH_SUCCESS,
                payload: { todos: data.tasks || [] },
            });
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.FETCH_ERROR,
                payload: {
                    message: `Error fetching todos: ${error.message}`,
                    isFilterError: Boolean(debouncedFilterTerm),
                }
            });
        }
    }
    fetchTodos();

  }, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion]);

  async function addTodo(todoTitle){

    const tempId = Date.now().toString();
    const newTodo = {
      id : tempId,
      title : todoTitle,
      isCompleted : false
    };

    dispatch({
        type: TODO_ACTIONS.ADD_TODO_START,
        payload: {newTodo},
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

        const data = await response.json();
        dispatch({
            type: TODO_ACTIONS.ADD_TODO_SUCCESS,
            payload: {
                tempId, 
                data 
            },
        });
    } catch (err) {

        dispatch({
            type: TODO_ACTIONS.ADD_TODO_ERROR,
            payload: { tempId, message: err.message },
        });
    }
  }

  async function completeTodo(id) {

    const originalTodo = todoList.find((todo) => String(todo.id) === String(id));
    if (!originalTodo) return;

    dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_START,
        payload: { id: originalTodo.id },
    });

    try {

        const response = await fetch(`/api/tasks/${originalTodo.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
            body: JSON.stringify({
                title: originalTodo.title,
                isCompleted: !originalTodo.isCompleted,
            }),
        });

        if (!response.ok) throw new Error('Failed to update todo');

        const data = await response.json();

        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
            payload: { id: originalTodo.id, data },
         });
    } catch (err) {

        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
            payload: {
                id: originalTodo.id,
                originalTodo,
                message: err.message,
            },
        });
    }
  }

  async function updateTodo(editedTodo) {

    const originalTodo = todoList.find((todo) => String(todo.id) === String(editedTodo.id));
    if (!originalTodo) return;

    dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_START,
        payload: { id: originalTodo.id, newTitle: editedTodo.title },
    });

    try {

        const response = await fetch(`/api/tasks/${originalTodo.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
            body: JSON.stringify({
                title: editedTodo.title,
                isCompleted: originalTodo.isCompleted,
            }),
        });

        if (!response.ok)
            throw new Error('Failed to update todo');

        const data = await response.json();

        dispatch({ 
            type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
            payload: { id: originalTodo.id, data}
        });
    } catch (err) {

        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_ERROR,
            payload: {
                id: originalTodo.id,
                originalTodo,
                message: err.message,
            },
        });
    }
  }

  async function deleteTodo(id) {
    const originalTodo = todoList.find((todo) => String(todo.id) === String(id));
    if(!originalTodo) return;

    dispatch({
        type: TODO_ACTIONS.DELETE_TODO_START,
        payload: { id: originalTodo.id },
    });

    try {
        const response = await fetch(`/api/tasks/${originalTodo.id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete todo');
        }

        dispatch({
            type: TODO_ACTIONS.DELETE_TODO_SUCCESS,
            payload: { id: originalTodo.id },
        });
    } catch (err) {
        dispatch({
            type: TODO_ACTIONS.DELETE_TODO_ERROR,
            payload: {
                id: originalTodo.id,
                originalTodo,
                message: err.message,
            }
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

        <StatusFilter />

        <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
        />

      <TodoForm onAddTodo={addTodo} />

        <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
        />
    </div>
  );
}

export default TodosPage;
