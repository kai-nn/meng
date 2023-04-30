import style from './Todo.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {completeTodo, delTodo} from "../../../../../../store/2_redux_toolkit/features/todo/todoSlice";
import React from "react";

const TodoItem = () => {
    const dispatch = useDispatch()
    const todos = useSelector(state => state.todo.todos)
    const del = (id) => {
        dispatch(delTodo(id))
    }
    const complete = (id) => {
        dispatch(completeTodo(id))
    }

    return (
        <div>
            {
                todos.map(el => {
                const {id, text, actual} = el
                return (
                    <div className={style.todo} key={id}>
                        <button onClick={() => complete(id)} type='text'>Close</button>
                        <div className={actual ? style.marked : ''}>{text}</div>
                        <button onClick={() => del(id)} type='text'>Del</button>
                    </div>
                )
                })
            }
        </div>
    )
}

export default TodoItem