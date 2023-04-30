import {configureStore} from '@reduxjs/toolkit'
import messageSlice from "./message/messageSlice";
import accessSlice from "./access/accessSlice";
import pageSlice from "./pagePanel/pageSlice";
import equipmentSlice from "./equipment/equipmentSlice";
// import socketMiddleware from "./socketMiddleware";

export const store = configureStore({
    reducer: {
        message: messageSlice,
        access: accessSlice,
        pagePanel: pageSlice,
        equipment: equipmentSlice,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware),
})