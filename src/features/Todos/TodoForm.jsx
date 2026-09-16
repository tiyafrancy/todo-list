import { useState } from "react";
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import {isValidTodoTitle} from '../../utils/todoValidation.js';
import styles from './TodoForm.module.css';

function TodoForm({onAddTodo}) {

  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValid = isValidTodoTitle(workingTodoTitle);

  const handleAddTodo = (event) => {
    event.preventDefault();

    if (!isValid) return;

    onAddTodo(workingTodoTitle.trim());
    setWorkingTodoTitle("");
    setIsTouched(false);
  };

    return (
      <div className={styles.formContainer}>
        <form onSubmit = {handleAddTodo} className={styles.form}>
          <div className={styles.inputWrapper}>
            <TextInputWithLabel 
              elementId="todoTitle"
              labelText="Add a new task"
              placeholder="What needs to be done?"
              value={workingTodoTitle}
              onChange={(event) => {
                setWorkingTodoTitle(event.target.value);
                if (!isTouched) setIsTouched(true);
              }}
            />
            {isTouched && workingTodoTitle.trim() === "" && (
              <p className={styles.errorMessage}>Task title cannot be empty.</p>
            )}
          </div>
          <button 
            type = "submit" 
            disabled={!isValid}
            className={styles.submitButton}
          >
            Add Todo
          </button>
        </form>
      </div>
    );
  }
  
  export default TodoForm;