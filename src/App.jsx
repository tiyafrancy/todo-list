import './App.css'
import TodoList from './TodoList.jsx'
import TodoForm from './TodoForm.jsx'


function App() {

//   const todoList = [
//     {id: 1, title: "review resources"},
//     {id: 2, title: "take notes"},
//     {id: 3, title: "code out app"},
// ]

  return (
    <div>
      {/* <h1>My Todos</h1> */}

      <h1>Todo List</h1>

      <TodoForm />
      
      {/* <ul>
            {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul> */}

      <TodoList />
  
    </div>
  )
}

export default App
