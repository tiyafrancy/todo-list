import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { useEffect, useState } from "react";
import {isValidTodoTitle} from "../../../utils/todoValidation";

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}){

    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    useEffect(() => {
        setWorkingTitle(todo.title);
    }, [todo.title]);

    function handleEdit(event){
        setWorkingTitle(event.target.value);
    }

    function handleCancel(){
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    function handleUpdate(event){
        if(event){
            event.preventDefault();
        }

        if(!isEditing) return;
        if(!isValidTodoTitle(workingTitle)) return;

        const updateTodo = {
            ...todo,
            title: workingTitle.trim()
        };

        onUpdateTodo(updateTodo);
        setIsEditing(false);
    }

    return (
        <li>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <TextInputWithLabel
                        elementId={`editTodo${todo.id}`}
                        labelText="Edit Todo"
                        value={workingTitle} 
                        onChange={handleEdit}
                    />
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        onClick={handleUpdate} 
                        disabled={!isValidTodoTitle(workingTitle)}
                    >
                        Update
                    </button>
                </form>
            ) : (
                <div>
                    <label>
                        <input 
                            type="checkbox"
                            id={`checkbox${todo.id}`}
                            checked={todo.isCompleted}
                            onChange={() => onCompleteTodo(todo.id)}
                        />
                    </label>
                    <span onClick={() => setIsEditing(true)}>{todo.title}</span>
                </div>
            )}
        </li>
    );
}
export default TodoListItem;