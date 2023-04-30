import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
    posts: [],
}

export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async (_, {rejectWithValue, dispatch}) => {
        const res = await axios.get('https://jsonplaceholder.typicode.com/todos/')
        dispatch(setPost(res.data))
    }
)

export const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPost: (state, action) => {
            state.posts = action.payload
        },
    },
    extraReducers: {
        [getPosts.fulfilled]: () => console.log('fulfilled'),
        [getPosts.pending]: () => console.log('pending'),
        [getPosts.rejected]: () => console.log('rejected'),
    }

})

export const {setPost} = postSlice.actions
export default postSlice.reducer