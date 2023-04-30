import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
    listTech: {}
}

export const getListTech = createAsyncThunk(
    'listTech/getListTech',
    async (_, {rejectedWithValue, dispatch}) => {
        const res = await axios.post('/list_tech', {
                filter: '',
                page: 1,
                page_len: 5,
            }
        )
        dispatch(setListTech(res.data))
    }
)

export const listTechSlice = createSlice({
    name: 'listTech',
    initialState,
    reducers: {
        setListTech: (state, action) => {
            state.tech = action.payload
        },
    },
    extraReducers: {
        [getListTech.fulfilled]: () => console.log('fulfilled'),
        [getListTech.pending]: () => console.log('pending'),
        [getListTech.rejected]: () => console.log('rejected'),
    }
})

export const { setListTech } = listTechSlice.actions
export default listTechSlice.reducer