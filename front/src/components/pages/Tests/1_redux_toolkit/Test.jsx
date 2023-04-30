import React from "react";
import {useState} from 'react'
import {useDispatch} from "react-redux";
import {addTodo} from "../../../../store/1_redux_toolkit/todoSlice";
import './Test.module.scss'
import TodoList from './components/TodoList'
import InputField from './components/InputField'


const Test = () => {
    // const [todos, setTodos] = useState([])
    const [text, setText] = useState('')
    const dispatch = useDispatch()

    const addTask = () => {
        dispatch(addTodo({text}))
        // очистка поля ввода
        setText('')
    }

    // const addTodo = () => {
    //     if (text.trim().length) {
    //         setTodos([
    //             ...todos,
    //             {
    //                 id: new Date().toISOString(),
    //                 text,
    //                 completed: false,
    //             }
    //         ])
    //         setText('')
    //     }
    // }

    const removeTodo = (todoId) => {
        // setTodos(todos.filter((el) => el.id !== todoId))
    }

    const toggleTodoComplete = (todoId) => {
        // setTodos(
        //     todos.map(
        //         todo => {
        //             if (todo.id !== todoId) return todo
        //
        //             return {
        //                 ...todo,
        //                 completed: !todo.completed
        //             }
        //         }
        //     )
        // )
    }

    return (
        <div>
            <InputField
                text={text}
                handleInput={setText}
                handleSubmit={addTask}
                // handleSubmit={addTodo}
            />
            <TodoList
                // todos={todos}
                // toggleTodoComplete={toggleTodoComplete}
                // removeTodo={removeTodo}
            />
        </div>
    )
}

export default Test