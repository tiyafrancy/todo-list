import { useState } from 'react';
import './App.css';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';


// const todos = [
//   {id: 1, title: "review resources"},
//   {id: 2, title: "take notes"},
//   {id: 3, title: "code out app"}
// ];

function App() {

  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle){

    const newTodo = {
      id : Date.now(),
      title : todoTitle,
      isCompleted : false
    };

    setTodoList(previous => [newTodo, ...previous]);

  }

  function completeTodo(id) {
    const updatedTodoList = todoList.map(todo => {
      if(todo.id === id){
        return {...todo, isCompleted: true};
      }
      return todo;
    });

    setTodoList(updatedTodoList);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
