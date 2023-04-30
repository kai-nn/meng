import style from './Todo.module.scss'
import React, {useState} from "react";
import TodoItem from "./TodoItem";
import {useDispatch} from "react-redux";
import {addTodo} from "../../../../../../store/2_redux_toolkit/features/todo/todoSlice";

const Todo = () => {
    const dispatch = useDispatch()
    const [input, setInput] = useState('')
    const addTodoItem = () => {
        const todo = {
            id: Date.now(),
            text: input,
            actual: false
        }
        if(input.trim().length !== 0) {
            dispatch(addTodo(todo))
            setInput('')
        }
    }

    return (
        <div className={style.window}>
                <input
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    placeholder="ToDo"
                />
                <button
                    onClick={addTodoItem}
                    type="button"
                >
                    Создать
                </button>

                <TodoItem />
        </div>
    )
}

export default Todo