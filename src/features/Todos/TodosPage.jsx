import { useEffect, useState } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function TodosPage({token}) {

  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {

    if(!token) return;

    async function fetchTodos() {
        setIsTodoListLoading(true);
        setError('');

        try {
            const response = await fetch('/api/tasks', {
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
            });

            if(response.status === 401) {
                throw new Error('unauthorised');
            }

            if(!response.ok) {
                throw new Error('Failed to fetch todo list');
            }

            const data = await response.json();
            setTodoList(data.tasks || []);
        } catch (err) {
            setError(err.message || 'An error occured while fetching todos');
        } finally {
            setIsTodoListLoading(false);
        }
    }

    fetchTodos();

  }, [token]);

  async function addTodo(todoTitle){

    const newTodo = {
      id : Date.now(),
      title : todoTitle,
      isCompleted : false
    };

    setTodoList((previous) => [newTodo, ...previous]);

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
        setTodoList((previous) => previous.map((todo) => (todo.id === newTodo.id ? savedTodo : todo))
        );
    } catch (err) {

        setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id));
        setError(err.message || 'Could not save todo. Please try again.');
    }
  }

  async function completeTodo(id) {

    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    const updatedTodoList = todoList.map((todo) => {
      if(todo.id === id){
        return {...todo, isCompleted: true};
      }
      return todo;
    });

    setTodoList(updatedTodoList);

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
    } catch (err) {

        setTodoList((previous) => previous.map((todo) => (todo.id === id ? originalTodo : todo))
        );
        setError(err.message || 'Could not complete task. Please try again.');
    }
  }

  async function updateTodo(editedTodo) {

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    const updatedTodos = todoList.map((todo) =>
    todo.id === editedTodo.id ? { ...todo, ...editedTodo } : todo
    );
    setTodoList(updatedTodos);

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
    } catch (err) {

        if (originalTodo) {
            setTodoList((previous) => previous.map((todo) => todo.id === editedTodo.id ? originalTodo : todo)
            );
        }
        setError(err.message || 'Could not update todo. Please try again.');
    }
  }

  return (
    <div>
      <h1>Todo List</h1>

      {error && (
        <div>
            <p>{error}</p>
            <button onClick={() => setError('')}>Clear Error</button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <TodoForm onAddTodo={addTodo} />

      {!isTodoListLoading && (
        <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
      )} 
    </div>
  );
}

export default TodosPage;
