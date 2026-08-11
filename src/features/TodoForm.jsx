// import { useRef, useState } from "react";
import { useState } from "react";
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import {isValidTodoTitle} from '../utils/todoValidation.js';

function TodoForm({onAddTodo}) {

  // const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  const handleAddTodo = (event) => {
    event.preventDefault();

    const trimmedTitle = workingTodoTitle.trim();

    if(trimmedTitle !== ""){
      onAddTodo(trimmedTitle);
      setWorkingTodoTitle("");
      // inputRef.current.focus();
    }
  };

    return (
      <form onSubmit = {handleAddTodo}>
        {/* <label htmlFor = "todoTitle">Todo</label>
        <input
          // ref = {inputRef}
          type = "text"
          id = "todoTitle"
          name = "todoTitle"
          placeholder = {"Todo text"}
          value={workingTodoTitle}
          onChange={(event) => setWorkingTodoTitle(event.target.value)}
          required
        /> */}
        <TextInputWithLabel 
          elementId="todoTitle"
          labelText="Todo"
          value={workingTodoTitle}
          onChange={(event) => setWorkingTodoTitle(event.target.value)}
        />
        <button type = "submit" disabled={!isValidTodoTitle(workingTodoTitle)}>
          Add Todo
        </button>
      </form>
    );
  }
  
  export default TodoForm;