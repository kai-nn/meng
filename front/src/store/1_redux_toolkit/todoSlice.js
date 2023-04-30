import { createSlice } from '@reduxjs/toolkit';

// срез с объектом, имеющий имя, изначальное состояние (пустой массив), и reducers с перечисленными методами, характерные для этого среза
const todoSlice = createSlice({
	name: 'todos',
	initialState: {
		todos: []
	},
	// фильтры или маски
	reducers: {

		addTodo(state, action){
			console.log('state', state)
			console.log('action', action)
			state.todos.push({
				id: new Date().toISOString(),
				// text: action.payload,
				text: action.payload.text,
				completed: false,
			})
		},

		removeTodo(state, action){},

		toggleTodoComplete(state, action){},
	},
})

export const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;
export default todoSlice.reducer;