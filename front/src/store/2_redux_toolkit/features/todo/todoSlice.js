import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    todos: []
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action) => {
            state.todos.push(action.payload)
        },
        delTodo: (state, action) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload)
        },
        completeTodo: (state, action) => {
            const value = state.todos.find(todo => todo.id === action.payload)
            value.actual = !value.actual
        }
    }
})

export const {addTodo, delTodo, completeTodo} = todoSlice.actions
export default todoSlice.reducer