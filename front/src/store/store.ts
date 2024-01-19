import {configureStore} from '@reduxjs/toolkit'
import messageSlice from "./message/messageSlice";
import accessSlice from "./access/accessSlice";
import pageSlice from "./pagePanel/pageSlice";
import equipmentSlice from "./equipment/equipmentSlice";
import presentationSlice from "./presentation/presentationSlice";
// import socketMiddleware from "./socketMiddleware";

export const store = configureStore({
    reducer: {
        message: messageSlice,
        access: accessSlice,
        pagePanel: pageSlice,
        equipment: equipmentSlice,
        presentation: presentationSlice,
    },
    // сдедующее для исключения предупреждения об использовании несериализуемых объектов GLTF
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch