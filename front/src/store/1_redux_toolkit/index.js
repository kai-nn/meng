import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice'

// само хранилище
export default configureStore({
	reducer: {
		// имя: метод с логикой, импортированной из др. файла
		todos: todoReducer,
	}
})