import {configureStore} from '@reduxjs/toolkit'
import listTechSlice from "./techSlice";

export const store = configureStore({
    reducer: {
        listTech: listTechSlice,
    }
})