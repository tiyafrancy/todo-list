import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { useState } from "react";
import {isValidTodoTitle} from "../../../utils/todoValidation";
import styles from "./TodoListItem.module.css";

function TodoListItem({todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }){

    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    const checkboxId = `checkbox-${todo.id}`;
    const editInputId = `editTodo-${todo.id}`;

    function handleEdit(event){
        setWorkingTitle(event.target.value);
    }

    function handleCancel(){
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    function handleUpdate(event){

        if(!isEditing) return;
        event.preventDefault();
        if(!isValidTodoTitle(workingTitle)) return;

        const updatedTodo = {
            ...todo,
            title: workingTitle.trim()
        };

        onUpdateTodo(updatedTodo);
        setIsEditing(false);
    }

    return (
        <li className={styles.item}>
            <form onSubmit={handleUpdate} className={styles.form}>
                {isEditing ? (
                    <div className={styles.editContainer}>
                        <TextInputWithLabel
                            elementId={editInputId}
                            labelText="Edit Todo"
                            value={workingTitle} 
                            onChange={handleEdit}
                        />
                        <div className={styles.actions}>
                            <button 
                                type="button" 
                                className={styles.button} 
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className={styles.button}
                                disabled={!isValidTodoTitle(workingTitle)}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.viewContainer}>
                        <div className={styles.contentGroup}>
                            <label className={styles.checkboxLabel} htmlFor={checkboxId}>
                                <input 
                                    type="checkbox"
                                    id={checkboxId}
                                    name={checkboxId}
                                    className={styles.checkbox}
                                    checked={Boolean(todo.isCompleted)}
                                    onChange={() => onCompleteTodo(todo.id)}
                                />
                            </label>
                            <span 
                                className={`${styles.title} ${todo.isCompleted ? styles.completedTitle : ''}`}
                                onClick={() => setIsEditing(true)}
                            >
                                {todo.title}
                            </span>
                        </div>
                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.button}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.deleteButton}`}
                                onClick={() => onDeleteTodo(todo.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </li>
    );
}
export default TodoListItem;